import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { RateLimiterMixin } from 'ddp-rate-limiter-mixin';
import LibraryNodes from '/imports/api/library/LibraryNodes';
import {
  assertDocCopyPermission,
  assertDocExists,
  assertEditPermission
} from '/imports/api/sharing/sharingPermissions';
import {
  renewDocIds,
  getFilter
} from '/imports/api/parenting/parentingFunctions';
import { rebuildNestedSets } from '/imports/api/parenting/parentingFunctions';
import Libraries from '/imports/api/library/Libraries';
import { TypedSimpleSchema } from '/imports/api/utility/TypedSimpleSchema';
import { type snackbar as snackbarType } from '../../../client/ui/components/snackbars/SnackbarQueue';
let snackbar: typeof snackbarType | undefined;
if (Meteor.isClient) {
  snackbar = require('../../../client/ui/components/snackbars/SnackbarQueue').snackbar
}

const DUPLICATE_CHILDREN_LIMIT = 500;

const copyLibraryNodeTo = new ValidatedMethod({
  name: 'libraryNodes.copyTo',
  validate: TypedSimpleSchema.from({
    _id: {
      type: String,
      max: 32,
    },
    rootId: {
      type: String,
      max: 32,
      optional: true,
    },
    parent: {
      type: Object,
      optional: true,
      blackbox: true,
    },
    parentId: {
      type: String,
      max: 32,
      optional: true,
    },
    left: {
      type: Number,
      optional: true,
    },
  }).validator(),
  mixins: [RateLimiterMixin],
  rateLimit: {
    numRequests: 1,
    timeInterval: 10000,
  },
  async run({ _id, rootId, parent, parentId, left }) {
    const libraryNode = await LibraryNodes.findOneAsync(_id);
    if (!libraryNode) throw new Meteor.Error('not-found', 'Library node was not found');

    // Derive rootId/parentId from parent ref when provided (V3 client convention)
    let resolvedRootId = rootId;
    let resolvedParentId = parentId;
    if (parent && parent.collection === 'libraryNodes') {
      const parentNode = await LibraryNodes.findOneAsync(parent.id);
      assertDocExists(parentNode);
      resolvedRootId = resolvedRootId || (parentNode as any).root?.id;
      resolvedParentId = resolvedParentId || parent.id;
    } else if (parent && parent.collection === 'libraries') {
      resolvedRootId = resolvedRootId || parent.id;
    }
    if (!resolvedRootId) throw new Meteor.Error('no-destination', 'A destination library is required');

    const destinationLibrary = await Libraries.findOneAsync(resolvedRootId);
    assertDocExists(destinationLibrary);
    await assertDocCopyPermission(libraryNode, this.userId);
    await assertEditPermission(destinationLibrary, this.userId);

    const resolvedLeft = left ?? 0.5;

    const decendants = await LibraryNodes.find({
      ...getFilter.descendants(libraryNode),
      removed: { $ne: true },
    }, {
      limit: DUPLICATE_CHILDREN_LIMIT + 1,
      sort: { left: 1 },
    }).fetchAsync();

    if (decendants.length > DUPLICATE_CHILDREN_LIMIT) {
      decendants.pop();
      snackbar?.({
        text: `Only the first ${DUPLICATE_CHILDREN_LIMIT} children were duplicated`,
      });
    }

    const nodes = [libraryNode, ...decendants];

    // Give the docs new IDs without breaking internal references
    renewDocIds({ docArray: nodes });

    // Order the root node
    libraryNode.left = resolvedLeft;
    libraryNode.right = resolvedLeft;
    libraryNode.parentId = resolvedParentId;

    for (const node of nodes) {
      await LibraryNodes.insertAsync(node);
    }

    // Tree structure changed by inserts, reorder the tree
    await rebuildNestedSets(LibraryNodes, destinationLibrary._id);
  },
});

export default copyLibraryNodeTo;

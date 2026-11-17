<script setup lang="ts">
import { computed } from 'vue';
import { autorun } from 'vue-meteor-tracker';
import { docsToForest, getFilter, getCollectionByName } from '/imports/api/parenting/parentingFunctions';
import TreeNodeList from '/imports/client/ui/components/tree/TreeNodeList.vue';
import {
  moveBetweenRoots as moveCreaturePropertyBetweenRoots,
  moveWithinRoot as moveCreaturePropertyWithinRoot,
} from '/imports/api/creature/creatureProperties/methods/organizeProperty';
import {
  moveBetweenRoots as moveLibraryNodeBetweenRoots,
  moveWithinRoot as moveLibraryNodeWithinRoot,
} from '/imports/api/library/methods/organizeLibraryNode';
import { organizeDoc } from '/imports/api/docs/Docs';
import type { Reference } from '/imports/api/parenting/reference';
import { snackbar } from '/imports/client/ui/components/snackbars/SnackbarQueue';
import errorToString from '/imports/api/utility/errorToString';

const props = defineProps<{
  model?: Record<string, any>;
  organize?: boolean;
  group?: string;
  collection?: string;
  expanded?: boolean;
}>();

const emit = defineEmits<{
  (e: 'selected', v: any): void;
  (e: 'length', n: number): void;
}>();

type MoveWithinRootEvent = {
  doc: { _id: string };
  newPosition: number;
};

type MoveBetweenRootsEvent = MoveWithinRootEvent & {
  newRootRef: Reference;
};

const resolvedCollection = computed(() => props.collection ?? 'creatureProperties');
// Child trees are scoped to their collection so a library node cannot be
// dropped into a creature property tree (or vice versa).
const resolvedGroup = computed(() => props.group ?? `${resolvedCollection.value}-tree`);

const { result: children } = autorun(() => {
  if (!props.model?.root) return [];
  const collection = getCollectionByName(resolvedCollection.value);
  const docs = collection.find({
    removed: { $ne: true },
    ...getFilter.descendants(props.model),
  }, { sort: { left: 1 } }).fetch();
  emit('length', docs.length);
  return docsToForest(docs);
});

function showMoveError(error: unknown) {
  snackbar({ text: errorToString(error) });
}

async function moveWithinRoot({ doc, newPosition }: MoveWithinRootEvent) {
  try {
    switch (resolvedCollection.value) {
      case 'creatureProperties':
        await moveCreaturePropertyWithinRoot.callAsync({
          propId: doc._id,
          newPosition,
        });
        break;
      case 'libraryNodes':
        await moveLibraryNodeWithinRoot.callAsync({
          nodeId: doc._id,
          newPosition,
        });
        break;
      case 'docs':
        await organizeDoc.callAsync({
          docId: doc._id,
          newPosition,
        });
        break;
      default:
        throw new Error(`Cannot move documents in ${resolvedCollection.value}`);
    }
  } catch (error) {
    showMoveError(error);
  }
}

async function moveBetweenRoots({ doc, newPosition, newRootRef }: MoveBetweenRootsEvent) {
  try {
    switch (resolvedCollection.value) {
      case 'creatureProperties':
        await moveCreaturePropertyBetweenRoots.callAsync({
          propId: doc._id,
          left: newPosition,
          newRoot: newRootRef,
        });
        break;
      case 'libraryNodes':
        await moveLibraryNodeBetweenRoots.callAsync({
          nodeId: doc._id,
          left: newPosition,
          newRoot: newRootRef,
        });
        break;
      case 'docs':
        // All docs share a single root and docs.organizeDoc only handles
        // within-root moves, so there is no safe cross-root docs move here.
        throw new Error('Moving docs between roots is not supported');
      default:
        throw new Error(`Cannot move documents in ${resolvedCollection.value}`);
    }
  } catch (error) {
    showMoveError(error);
  }
}
</script>

<template lang="html">
  <tree-node-list
    v-if="model && model.root"
    :children="children"
    :group="resolvedGroup"
    :organize="organize"
    :start-expanded="expanded"
    :root="model.root"
    @selected="e => $emit('selected', e)"
    @move-within-root="moveWithinRoot"
    @move-between-roots="moveBetweenRoots"
  />
</template>

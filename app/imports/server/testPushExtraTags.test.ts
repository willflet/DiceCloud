import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import '/imports/api/simpleSchemaConfig';
import Libraries, { insertLibrary } from '/imports/api/library/Libraries';
import LibraryNodes, { pushToLibraryNode } from '/imports/api/library/LibraryNodes';
import { insertLibraryNode } from '/imports/api/library/methods/insertLibraryNode';

describe('push extra tags on library node', function () {
  it('adds an extraTags entry', async function () {
    const userId = Random.id();
    await Meteor.users.insertAsync({ _id: userId, username: 'tester', createdAt: new Date() });
    try {
      // Use runAsUser? Instead call methods with this bound? Methods use this.userId.
      // We'll invoke via Meteor.callAsync is not user-bound. Use a direct approach:
      // Insert library and node directly with owner userId.
      const libraryId = await Libraries.insertAsync({ name: 'Lib', owner: userId, readers: [], writers: [], public: false });
      const nodeId = await LibraryNodes.insertAsync({
        type: 'propertySlot',
        name: 'Slot',
        root: { collection: 'libraries', id: libraryId },
        slotType: 'feature',
        slotTags: [],
        tags: [],
        owner: userId,
        readers: [],
        writers: [],
        public: false,
      });
      // Call method as the user using a stubbed invocation
      const method = pushToLibraryNode as any;
      const result = await method._execute({ userId }, { _id: nodeId, path: ['extraTags'], value: { _id: 'abc', operation: 'OR', tags: [] } });
      console.log('push result', result);
      const node = await LibraryNodes.findOneAsync(nodeId);
      console.log('extraTags after push:', JSON.stringify(node?.extraTags));
      assert.isArray(node?.extraTags, 'extraTags should be an array');
      assert.lengthOf(node!.extraTags!, 1, 'should have one extra tag entry');
    } finally {
      await Meteor.users.removeAsync(userId);
    }
  });
});

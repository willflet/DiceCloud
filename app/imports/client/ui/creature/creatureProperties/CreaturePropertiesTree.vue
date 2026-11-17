<script setup lang="ts">
import { computed } from 'vue';
import { autorun } from 'vue-meteor-tracker';
import { filterToForest, getCollectionByName } from '/imports/api/parenting/parentingFunctions';
import TreeNodeList from '/imports/client/ui/components/tree/TreeNodeList.vue';
import { moveBetweenRoots as moveBetweenRootsMethod, moveWithinRoot as moveWithinRootMethod } from '../../../../api/creature/creatureProperties/methods/organizeProperty';
import { snackbar } from '/imports/client/ui/components/snackbars/SnackbarQueue';
import errorToString from '/imports/api/utility/errorToString';

const props = defineProps<{
  root?: Record<string, any>;
  organize?: boolean;
  selectedNode?: Record<string, any>;
  filter?: Record<string, any>;
  group?: string;
  collection?: string;
  expanded?: boolean;
}>();

const emit = defineEmits<{
  (e: 'selected', v: any): void;
  (e: 'length', n: number): void;
}>();

// Filtered forests contain ancestors and descendants, but omit siblings, so
// their visible order cannot be used to calculate a reliable nested-set move.
const hasFilter = computed(() => !!props.filter && Object.keys(props.filter).length > 0);

const { result: children } = autorun(() => {
  const result = filterToForest?.(
    getCollectionByName(props.collection ?? 'creatureProperties'),
    props.root?.id,
    props.filter,
    {
      includeFilteredDocAncestors: true,
      includeFilteredDocDescendants: true,
    }
  ) || [];
  emit('length', result.length);
  return result;
});

async function moveWithinRoot({ doc, newPosition }: any) {
  try {
    await moveWithinRootMethod.callAsync({
      propId: doc._id,
      newPosition,
    });
  } catch (error) {
    snackbar({ text: errorToString(error) });
  }
}

async function moveBetweenRoots({ doc, newPosition, newRootRef }: any) {
  try {
    await moveBetweenRootsMethod.callAsync({
      propId: doc._id,
      left: newPosition,
      newRoot: newRootRef,
    });
  } catch (error) {
    snackbar({ text: errorToString(error) });
  }
}
</script>

<template lang="html">
  <tree-node-list
    v-if="root"
    :children="children"
    :group="group"
    :organize="organize && !hasFilter"
    :selected-node="selectedNode"
    :start-expanded="expanded"
    :root="root"
    @selected="e => $emit('selected', e)"
    @move-within-root="moveWithinRoot"
    @move-between-roots="moveBetweenRoots"
  />
</template>

<style lang="css" scoped>

</style>

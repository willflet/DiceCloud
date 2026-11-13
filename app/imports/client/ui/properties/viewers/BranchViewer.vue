<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ model: Record<string, any> }>();

const name = computed(() => {
  switch (props.model.branchType) {
    case 'if': return 'On condition';
    case 'hit': return 'On hit';
    case 'miss': return 'On miss';
    case 'failedSave': return 'On failed save';
    case 'successfulSave': return 'On save';
    case 'eachTarget': return 'Each target';
    case 'random': return 'Pick one at random';
    case 'index': return 'Pick one by index';
    case 'choice': return 'User choice';
    default: return '';
  }
});
</script>

<template lang="html">
  <div class="branch-viewer">
    <v-row dense>
      <property-field
        name="Branch Type"
        :value="name"
      />
      <property-field
        v-if="model.branchType === 'if'"
        name="Condition"
        :calculation="model.condition"
      />
      <property-field
        v-else-if="model.branchType === 'index'"
        name="Index"
        :calculation="model.condition"
      />
    </v-row>
  </div>
</template>


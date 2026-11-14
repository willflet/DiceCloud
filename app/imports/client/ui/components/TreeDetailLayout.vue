<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
  showLeftTree?: boolean;
}>();

const slots = useSlots();
const { smAndDown, xl } = useDisplay();

const computedTreeStyle = computed(() => {
  if (smAndDown.value) return undefined;
  let style = 'flex-shrink: 0; flex-grow: 0; ';
  if (xl.value) {
    style += 'width: 400px;';
  } else {
    style += 'width: 320px;';
  }
  return style;
});

const hasLeftTree = computed(() => props.showLeftTree ?? !!slots['left-tree']);
</script>

<template lang="html">
  <div
    class="layout"
    style="height: 100%;"
  >
    <div
      v-if="hasLeftTree"
      class="d-flex flex-column justify-start"
      :style="computedTreeStyle"
    >
      <slot
        name="left-tree"
      />
    </div>
    <v-divider
      v-if="hasLeftTree" 
      vertical
    />
    <div
      class="d-flex flex-column justify-start"
      :style="computedTreeStyle"
    >
      <slot name="tree" />
    </div>
    <template v-if="$vuetify.display.mdAndUp">
      <v-divider vertical />
      <div
        class="flex layout column"
        style="background-color: inherit; overflow: hidden; min-height: 100%;"
        data-id="selected-node-card"
      >
        <slot name="detail" />
      </div>
    </template>
  </div>
</template>

<style lang="css" scoped>
</style>

<script setup lang="ts">
import { computed } from 'vue';
import MarkdownText from '/imports/client/ui/components/MarkdownText.vue';

const props = withDefaults(defineProps<{
  model?: Record<string, any>;
  name?: string;
  text?: boolean;
}>(), {
  model: undefined,
  name: undefined,
  text: false,
});

const textValue = computed(() => {
  if (!props.model) return undefined;
  if (typeof props.model.value === 'string') {
    return props.model.value;
  } else {
    return props.model.text;
  }
});
</script>

<template lang="html">
  <markdown-text
    v-if="text && model"
    :markdown="textValue"
  />
  <property-field
    v-else-if="model && textValue"
    :name="name"
    :cols="{cols: 12}"
  >
    <markdown-text :markdown="textValue" />
  </property-field>
</template>


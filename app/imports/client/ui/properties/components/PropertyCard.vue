<script setup lang="ts">
import ActionCard from '/imports/client/ui/properties/components/actions/ActionCard.vue';

withDefaults(defineProps<{
  model?: Record<string, any>;
}>(), {
  model: undefined,
});

// Property card components by property type. In Vue 2 this resolved through
// the local `components` option, which is not accessible from a template in
// Vue 3, so it is defined explicitly here.
const components: Record<string, unknown> = {
  action: ActionCard,
};
</script>

<template lang="html">
  <component
    :is="components[model.type]"
    v-if="model && components[model.type]"
  />
  <v-card v-else-if="model">
    <v-card-title class="text-error">
      A property card for the {{ model.type }} isn't defined. You should report this error.
    </v-card-title>
  </v-card>
</template>

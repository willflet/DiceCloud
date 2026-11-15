<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  model: Record<string, any>;
  errors?: Record<string, string>;
}>(), {
  errors: () => ({}),
});

const emit = defineEmits(['change']);

function change(path: string | string[], value: any, ack?: Function) {
  const pathArray = Array.isArray(path) ? path : [path];
  emit('change', { path: pathArray, value, ack });
}

const locationItems = computed(() => {
  if (props.model.tab === 'stats') {
    return [
      { title: 'Start', value: 'start' },
      { title: 'After events', value: 'events' },
      { title: 'After stats', value: 'stats' },
      { title: 'After skills', value: 'skills' },
      { title: 'After proficiencies', value: 'proficiencies' },
      { title: 'End', value: 'end' },
    ];
  } else {
    return [
      { title: 'Start', value: 'start' },
      { title: 'End', value: 'end' },
    ];
  }
});

function changeTab(path: string | string[], value: any, ack?: Function) {
  const pathArray = Array.isArray(path) ? path : [path];
  if (
    value !== 'stats' &&
    (props.model.location !== 'start' && props.model.location !== 'end')
    || (!props.model.location && value)
  ) {
    emit('change', { path: ['location'], value: 'start' });
  }
  emit('change', { path: pathArray, value, ack });
}
</script>

<template lang="html">
  <div class="folder-form">
    <inline-computation-field
      label="Description"
      :model="model.description"
      :error-messages="errors['description.text']"
      @change="({path, value, ack}) =>
        $emit('change', {path: ['description', ...path], value, ack})"
    />
    <form-sections type="folder">
      <form-section name="Grouping">
        <smart-switch
          label="Group children on a card"
          :value="model.groupStats"
          :error-messages="errors.groupStats"
          @change="(value, ack) => change('groupStats', value, ack)"
        />
        <v-expand-transition>
          <div v-if="model.groupStats">
            <smart-switch
              label="Hide children from their default locations"
              :value="model.hideStatsGroup"
              :error-messages="errors.hideStatsGroup"
              @change="(value, ack) => change('hideStatsGroup', value, ack)"
            />
            <smart-select
              clearable
              label="Tab"
              :items="[
                { title: 'Stats Tab', value: 'stats' },
                { title: 'Features Tab', value: 'features' },
                { title: 'Actions Tab', value: 'actions' },
                { title: 'Spells Tab', value: 'spells' },
                { title: 'Inventory Tab', value: 'inventory' },
                { title: 'Journal Tab', value: 'journal' },
                { title: 'Build Tab', value: 'build' },
              ]"
              :value="model.tab"
              :error-messages="errors.tab"
              :menu-props="{auto: true, lazy: true}"
              @change="(value, ack) => changeTab('tab', value, ack)"
            />
            <smart-select
              clearable
              label="Location"
              :items="locationItems"
              :value="model.location"
              :error-messages="errors.location"
              :menu-props="{auto: true, lazy: true}"
              @change="(value, ack) => change('location', value, ack)"
            />
          </div>
        </v-expand-transition>
      </form-section>
      <slot />
    </form-sections>
  </div>
</template>

<style lang="css" scoped>

</style>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import useHasEventListener from '/imports/client/ui/utility/useHasEventListener';
import numberToSignedString from '/imports/api/utility/numberToSignedString';

const props = defineProps<{
  model: Record<string, any>;
}>();

const emit = defineEmits(['click', 'change']);
const context = inject('context', {});

const hasClickListener = useHasEventListener('click');
const hover = ref(false);

const signedConMod = computed(() => numberToSignedString(props.model.constitutionMod));

function click(e: Event) {
  emit('click', e);
}

function increment(value: number) {
  emit('change', { type: 'increment', value });
}
</script>

<template lang="html">
  <v-list-item
    class="hit-dice-list-tile"
    :class="{hover}"
    v-on="hasClickListener ? { click } : {}"
  >
    <div class="d-flex">
      <div class="buttons layout column justify-center pl-3">
        <v-btn
          icon
          variant="text"
          size="small"
          :disabled="model.value >= model.total || context.editPermission === false"
          @click="increment(1)"
        >
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          size="small"
          :disabled="model.value <= 0 || context.editPermission === false"
          @click="increment(-1)"
        >
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center value pl-2 pr-3">
        <div class="text-h4">
          {{ model.value }}
        </div>
        <div class="text-h6 ml-2 max-value">
          /{{ model.total }}
        </div>
      </div>
      <div
        class="content layout align-center pr-3"
        @click="click"
      >
        <div class="text-truncate">
          {{ model.hitDiceSize }} {{ signedConMod }}
        </div>
      </div>
    </div>
  </v-list-item>
</template>

<style lang="css" scoped>
.hit-dice-list-tile {
  background: inherit;
}

.buttons,
.value {
  flex-shrink: 0;
  flex-grow: 0;
}

.buttons > .v-btn {
  margin: 0;
}

.content {
  cursor: pointer;
}

.max-value {
  color: rgba(0, 0, 0, .54);
}

.v-theme--dark .max-value {
  color: rgba(255, 255, 0.54);
}
</style>
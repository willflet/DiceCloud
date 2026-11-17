<script setup lang="ts">
import { ref } from 'vue';
import DialogBase from '/imports/client/ui/dialogStack/DialogBase.vue';
import CreaturePropertiesTree from '/imports/client/ui/creature/creatureProperties/CreaturePropertiesTree.vue';

const props = defineProps<{
  creatureId: string;
}>();

const parentId = ref<string | undefined>(undefined);
</script>

<template lang="html">
  <dialog-base>
    <template #toolbar>
      <v-toolbar-title>
        Select new location
      </v-toolbar-title>
    </template>
    <template #unwrapped-content>
      <creature-properties-tree
        style="height: 100%;"
        :root="{ collection: 'creatures', id: props.creatureId }"
        :collection="'creatureProperties'"
        @selected="id => parentId = id"
      />
    </template>
    <template #actions>
      <v-btn
        variant="text"
        color="primary"
        @click="$store.dispatch('popDialogStack')"
      >
        Cancel
      </v-btn>
      <v-spacer />
      <v-btn
        variant="text"
        color="primary"
        :disabled="!parentId"
        @click="$store.dispatch('popDialogStack', parentId)"
      >
        Move
      </v-btn>
    </template>
  </dialog-base>
</template>

<style lang="css" scoped>
</style>

<script setup lang="ts">
import { autorun } from 'vue-meteor-tracker';
import DialogBase from '/imports/client/ui/dialogStack/DialogBase.vue';
import CharacterSheet from '/imports/client/ui/creature/character/CharacterSheet.vue';
import Creatures from '/imports/api/creature/creatures/Creatures';

const props = defineProps<{
  creatureId: string;
}>();

const { result: creature } = autorun(() => {
  if (!props.creatureId) return;
  return Creatures.findOne(props.creatureId);
});
</script>

<template>
  <dialog-base>
    <template #toolbar>
      <v-toolbar-title>
        {{ creature && creature.name }}
      </v-toolbar-title>
    </template>
    <template #unwrapped-content>
      <character-sheet
        show-menu-button
        embedded
        :creature-id="creatureId"
      />
    </template>
    <template #actions>
      <v-bottom-navigation
        mode="shift"
        mandatory
        class="bottom-nav-btns"
        style="position: relative;"
        :model-value="$store.getters.tabById(creatureId)"
        @update:model-value="e => $store.commit(
          'setTabForCharacterSheet',
          {id: creatureId, tab: e}
        )"
      >
        <v-btn>
          <v-icon>mdi-chart-box</v-icon>
          <span>Stats</span>
        </v-btn>
        <v-btn>
          <v-icon>mdi-lightning-bolt</v-icon>
          <span>Actions</span>
        </v-btn>
        <v-btn v-if="!creature.settings.hideSpellsTab">
          <v-icon>mdi-fire</v-icon>
          <span>Spells</span>
        </v-btn>
        <v-btn>
          <v-icon>mdi-cube</v-icon>
          <span>Inventory</span>
        </v-btn>
        <v-btn>
          <v-icon>mdi-text</v-icon>
          <span>Features</span>
        </v-btn>
        <v-btn>
          <v-icon>mdi-book-open-variant</v-icon>
          <span>Journal</span>
        </v-btn>
        <v-btn>
          <v-icon>mdi-wrench</v-icon>
          <span>Build</span>
        </v-btn>
      </v-bottom-navigation>
    </template>
  </dialog-base>
</template>

<style lang="css" scoped>
.bottom-nav-btns {
  margin: -8px;
  box-shadow: none !important;
  flex-grow: 1;
  max-width: unset !important;
}
.bottom-nav-btns .v-bottom-navigation__content > .v-btn{
  min-width: 0 !important;
  padding: 0 !important;
  flex: 1 1 0 !important;
  font-size: 0.6rem !important;
}

.bottom-nav-btns .v-btn--stacked .v-icon {
  margin-bottom: 8px !important;
}
</style>

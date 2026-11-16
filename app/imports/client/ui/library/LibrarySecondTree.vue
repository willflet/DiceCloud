<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { autorun, subscribe } from 'vue-meteor-tracker';
import { Meteor } from 'meteor/meteor';
import LibraryList from '/imports/client/ui/library/LibraryList.vue';
import LibraryContentsContainer from '/imports/client/ui/library/LibraryContentsContainer.vue';
import Libraries from '/imports/api/library/Libraries';
import { assertEditPermission } from '/imports/client/permissions/sharingPermissions';

defineProps<{ selectedNode?: Record<string, any> }>();

const router = useRouter();
const libraryId = ref<string | undefined>(undefined);

function openSelectedLibrary() {
  const selectedId = library.value?._id;
  libraryId.value = undefined;
  if (selectedId) {
    router.push({ name: 'singleLibrary', params: { id: selectedId } });
  }
}

const { result: library } = autorun(() => Libraries.findOne(libraryId.value));

const { result: canEditLibrary } = autorun(() => {
  if (!libraryId.value) return false;
  try {
    assertEditPermission(library.value, Meteor.userId());
    return true;
  } catch (e) {
    return false;
  }
});

subscribe(() => libraryId.value ? ['library', libraryId.value] : false);
</script>

<template lang="html">
  <div class="d-flex flex-column fill-height">
    <v-fade-transition mode="out-in">
      <v-toolbar
        v-if="libraryId"
        dark
        flat
        color="secondary"
      >
        <v-btn
          icon
          @click="libraryId = undefined"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title
          key="library-name"
          class="d-flex"
        >
          <div class="flex-shrink-1">
            {{ library && library.name }}
          </div>
          <v-spacer />
        </v-toolbar-title>
        <v-btn
          v-if="library && ($route.params.id !== library._id)"
          icon
          @click="openSelectedLibrary"
        >
          <v-icon>mdi-arrow-right-bold</v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar
        v-else
        dark
        flat
        color="secondary"
      >
        <v-toolbar-title
          key="no-library"
        >
          <v-btn
            icon
            @click="$emit('close')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          Select Library
        </v-toolbar-title>
      </v-toolbar>
    </v-fade-transition>
    <v-sheet
      class="pa-3 flex-grow-1 flex-shrink-1"
      style="overflow: auto;"
    >
      <v-fade-transition mode="out-in">
        <library-list
          v-if="!libraryId"
          selection
          single-select
          @select-library="id => libraryId = id"
        />
        <library-contents-container
          v-else
          :library-id="libraryId"
          :organize-mode="canEditLibrary"
          should-subscribe
          :selected-node="selectedNode"
          @selected="e => $emit('selected', e)"
        />
      </v-fade-transition>
    </v-sheet>
  </div>
</template>

<style lang="css" scoped>
</style>

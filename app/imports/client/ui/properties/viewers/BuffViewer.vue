<script setup lang="ts">
defineProps<{ model: Record<string, any> }>();
</script>

<template lang="html">
  <div class="buff-viewer">
    <!--<property-field
      name="Duration"
      :value="model.duration"
    />-->
    <v-row dense>
      <property-field
        v-if="model.target === 'self'"
        name="Target"
        value="Self"
      />
    </v-row>
    <v-row dense>
      <property-description
        name="Description"
        :model="model.description"
      />
    </v-row>
  </div>
</template>


<script setup lang="ts">
import { autorun, subscribe } from 'vue-meteor-tracker';
import prettyBytes from 'pretty-bytes';
import UserImages from '/imports/api/files/userImages/UserImages';
import UserImageCard from '/imports/client/ui/files/userImages/UserImageCard.vue';
import ImageUploadInput from '/imports/client/ui/components/ImageUploadInput.vue';

subscribe('userImages');

const { result: userImages } = autorun(() => {
  const userId = Meteor.userId();
  return UserImages.find({ userId }, { sort: { size: -1 } }).map((f: any) => {
    f.size = prettyBytes(f.size);
    f.link = UserImages.link(f);
    return f;
  });
});
</script>

<template>
  <v-row class="density">
    <v-col cols="12">
      <v-list-subheader> Images </v-list-subheader>
    </v-col>
    <template v-if="userImages && userImages.length">
      <v-col
        v-for="userImage in userImages"
        :key="userImage._id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <user-image-card :model="userImage" />
      </v-col>
    </template>
    <v-col
      key="upload"
      cols="12"
      sm="6"
      md="4"
      lg="3"
      xl="2"
      class="d-flex flex-column justify-center"
    >
      <image-upload-input
        style="height: 100%; min-height: 120px;"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { appPath } from '/imports/api/utility/basePath';
</script>

<template lang="html">
  <div>
    <section>
      <v-parallax
        :src="appPath('/images/paper-dice-crown.webp')"
        height="300"
      >
        <div class="d-flex flex-column align-center justify-center text-white">
          <p
            class="text-white ma-2 text-center"
            style="max-width: 1200px;"
          >
            DiceCloud is a single-developer project started in 2014 with the aim of
            being a character sheet that stayed in sync between the DM and their
            players, and made it clear where every value in the sheet came from, and
            how it was calculated.
          </p>
        </div>
      </v-parallax>
    </section>
    <section class="d-flex flex-column align-center ma-2 mt-4">
      <div>
        <h3 class="text-h5 mb-2">
          Forked from DiceCloud
        </h3>
        <p>
          Visit dicecloud.com to see ThaumRystra's original, or visit github.com/ThaumRystra/DiceCloud.
        </p>
      </div>
    </section>
  </div>
</template>

<style lang="css" scoped>
</style>

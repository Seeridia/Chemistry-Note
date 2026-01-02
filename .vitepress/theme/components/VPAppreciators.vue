<script setup lang="ts">
import VPAppreciatorsItem from "./VPAppreciatorsItem.vue";

interface Appreciator {
  amount: string;
  name: string;
  message: string;
  date: string;
}

defineProps<{
  items: Appreciator[];
}>();
</script>

<template>
  <div class="VPAppreciators">
    <div class="container">
      <div v-for="(item, index) in items" :key="index" class="item">
        <VPAppreciatorsItem :item="item" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPAppreciators {
  margin-top: 24px;
}

.container {
  display: grid;
  gap: 24px;
  margin: 0 auto;
  max-width: 1152px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>

<template>
  <div class="CCAppreciatePayments">
    <div v-for="item in items" :key="item.type">
      <img
        :src="item.qrCodeSrc"
        :alt="item.altText || item.type"
        class="item"
        @error="handleImageError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface AppreciatePayment {
  type: string;
  qrCodeSrc: string;
  altText?: string;
}

defineProps<{
  items: AppreciatePayment[];
}>();

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
  console.warn("Image failed to load:", img.src);
};
</script>

<style scoped>
.CCAppreciatePayments {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.item {
  height: 300px;
  object-fit: contain;
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s;
}

.item:hover {
  border-color: var(--vp-c-brand-1);
}
</style>

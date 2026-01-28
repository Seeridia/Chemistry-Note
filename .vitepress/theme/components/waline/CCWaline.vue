<script setup>
import { Waline } from "@waline/client/component";
import { useData } from "vitepress";
import { useWalineBase } from "./useWalineBase";

const { isDark } = useData();
const { serverURL, path } = useWalineBase();
</script>

<template>
  <Waline :serverURL="serverURL" :path="path" :key="path" :dark="isDark" />
</template>

<style scoped>
[data-waline] {
  --waline-theme-color: var(--vp-button-brand-bg);
  --waline-active-color: var(--vp-button-brand-hover-bg);
}

@media print {
  [data-waline] {
    display: none;
  }
}

:deep(.wl-panel) {
  margin: 8px 0px;
  border-radius: 8px;
}
</style>

<script setup lang="ts">
const handlePrint = () => {
  if (typeof window === "undefined") return;
  window.print();
};
</script>

<template>
  <div class="CCPrintButton">
    <button type="button" class="CCPrintButtonBtn" @click="handlePrint">
      打印 / 导出为 PDF
    </button>
  </div>
</template>

<style scoped>
.CCPrintButton {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
}

.CCPrintButtonBtn {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1;
  transition:
    border-color 0.25s,
    background-color 0.25s,
    color 0.25s;
  cursor: pointer;
}

.CCPrintButtonBtn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft-hover);
  color: var(--vp-c-brand-1);
}

@media print {
  .CCPrintButton {
    display: none;
  }
}
</style>

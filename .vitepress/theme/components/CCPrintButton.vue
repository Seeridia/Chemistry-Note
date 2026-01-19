<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const { page } = useData();

const PDF_BASE_URL =
  "https://cnb.cool/Seeridia/Chemistry-Note-File/-/git/raw/main/";

const pdfUrl = computed(() => {
  const filePath = page.value.filePath ?? "";
  if (!filePath.endsWith(".md")) return "";
  const pdfPath = filePath.replace(/\.md$/i, ".pdf");
  return `${PDF_BASE_URL}${encodeURI(pdfPath)}?download=true`;
});

const handlePrint = () => {
  if (typeof window === "undefined") return;
  window.print();
};
</script>

<template>
  <div class="CCPrintButton">
    <button
      type="button"
      class="CCPrintButtonBtn CCPrintButtonBtn--print"
      @click="handlePrint"
    >
      打印
    </button>
    <a
      v-if="pdfUrl"
      class="CCPrintButtonBtn"
      :href="pdfUrl"
      target="_blank"
      rel="noopener"
    >
      下载 PDF
    </a>
  </div>
</template>

<style scoped>
.CCPrintButton {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
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

@media (max-width: 768px) {
  .CCPrintButtonBtn--print {
    display: none;
  }
}

@media (min-width: 769px) {
  .CCPrintButton {
    margin-top: 20px;
  }
}

@media print {
  .CCPrintButton {
    display: none;
  }
}
</style>

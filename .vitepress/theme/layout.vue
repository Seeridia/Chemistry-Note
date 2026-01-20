<script setup>
import DefaultTheme from "vitepress/theme";
import Breadcrumb from "./components/CCBreadCrumb.vue";
import PdfDownloadButton from "./components/CCPdfDownloadButton.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-before>
      <Breadcrumb />
    </template>
    <!-- 只有在移动端显示该 PDF 下载按钮，桌面端的按钮在了导航栏里 -->
    <template #nav-bar-content-before>
      <div class="PdfDownloadButton">
        <PdfDownloadButton />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.PdfDownloadButton {
  display: none;
}

@media (max-width: 768px) {
  .PdfDownloadButton {
    display: block;
  }
}
</style>

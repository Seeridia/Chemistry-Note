<script setup>
import DefaultTheme from "vitepress/theme";
import Breadcrumb from "./components/CCBreadCrumb.vue";
import PdfDownloadButton from "./components/CCPdfDownloadButton.vue";
import { CCPageviews, CCWaline } from "./components/waline";
import CCFooter from "./components/CCFooter.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <!-- 面包屑 -->
    <template #doc-before>
      <Breadcrumb />
    </template>

    <!-- 评论区 -->
    <template #doc-after>
      <CCWaline />
    </template>

    <!-- 浏览量 -->
    <template #aside-bottom>
      <CCPageviews />
    </template>

    <!-- 页脚信息 -->
    <template #doc-bottom>
      <CCFooter />
    </template>

    <!-- PDF 下载按钮 -->
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

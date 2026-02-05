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
      <ClientOnly>
        <CCWaline />
      </ClientOnly>
    </template>

    <!-- 浏览量 -->
    <template #aside-bottom>
      <ClientOnly>
        <CCPageviews />
      </ClientOnly>
    </template>

    <!-- 页脚信息 -->
    <template #doc-bottom>
      <CCFooter />
    </template>
  </Layout>
</template>
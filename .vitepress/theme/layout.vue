<script setup>
import DefaultTheme from "vitepress/theme";
import Breadcrumb from "./components/CCBreadCrumb.vue";
import PrintButton from "./components/CCPrintButton.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-before>
      <Breadcrumb />
    </template>
    <template #aside-outline-after>
      <PrintButton />
    </template>
  </Layout>
</template>

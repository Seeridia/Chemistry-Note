<script setup>
import DefaultTheme from "vitepress/theme";
import Breadcrumb from "./components/CCBreadCrumb.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-before>
      <Breadcrumb />
    </template>
  </Layout>
</template>

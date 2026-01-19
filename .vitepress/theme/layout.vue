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
    <template #nav-bar-content-before>
      <div class="CCPrintButtonSlot CCPrintButtonSlot--mobile">
        <PrintButton />
      </div>
    </template>
    <template #aside-outline-after>
      <div class="CCPrintButtonSlot CCPrintButtonSlot--aside">
        <PrintButton />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.CCPrintButtonSlot--mobile {
  display: none;
}

@media (max-width: 768px) {
  .CCPrintButtonSlot--aside {
    display: none;
  }

  .CCPrintButtonSlot--mobile {
    display: block;
  }
}
</style>

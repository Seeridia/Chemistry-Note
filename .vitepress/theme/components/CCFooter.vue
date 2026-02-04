<!-- 当前的目的是在打印（PDF）页面时 显示页脚内容 -->
<template>
  <div>
    <footer class="cc-footer">
      <p class="cc-footer__title">{{ pageTitle }}</p>
      <p class="cc-footer__meta">
        <span>Chemistry-note.seeridia.top</span>
        <span class="cc-footer__dot">•</span>
        <span>Anyayay's Chemistry Note</span>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useData } from "vitepress";
import { computed } from "vue";

const data = useData();
const pageTitle = computed(() => data.page.value.title || "");
</script>

<style scoped>
.cc-footer {
  display: none;
}

@media print {
  .cc-footer {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    font-size: 12px;
    color: #555;
    margin-top: 24px;
    padding-top: 10px;
    border-top: 1px solid #d7d7d7;
    letter-spacing: 0.2px;
    font-family: var(--vp-font-family-base, "Times New Roman", serif);
  }

  .cc-footer__title {
    font-weight: 600;
    margin: 0;
    flex: 1 1 auto;
    min-width: 0;
  }

  .cc-footer__meta {
    color: #666;
    margin: 0;
    flex: 0 0 auto;
    text-align: right;
    white-space: nowrap;
  }

  .cc-footer__dot {
    margin: 0 6px;
    color: #9a9a9a;
  }
}
</style>

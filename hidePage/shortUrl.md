---
layout: false
head:
  - - meta
    - name: robots
      content: noindex
---

<!-- 参考自 https://notes.linho.cc/s?q=adaf352048 -->

<div class="short-url-loading">跳转中...</div>
<ClientOnly><Jumper /></ClientOnly>

<script lang="ts" setup>
import Jumper from '/.vitepress/theme/components/shortUrl/CCJumper.vue'
</script>

<style scoped>
.short-url-loading {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
}
</style>

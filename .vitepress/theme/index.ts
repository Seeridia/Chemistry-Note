import DefaultTheme from "vitepress/theme";
import type { App } from "vue";
import layout from "./layout.vue";
import "./custom.css";
import "@waline/client/style";

import CCPdfDownloadButton from "./components/CCPdfDownloadButton.vue";

export default {
  extends: DefaultTheme,
  Layout: layout,
  enhanceApp({ app }: { app: App }) {
    app.component("CCPdfDownloadButton", CCPdfDownloadButton);
  },
};

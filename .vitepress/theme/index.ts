import DefaultTheme from "vitepress/theme";
import type { App } from "vue";
import layout from "./layout.vue";
import "./custom.css";
import "@waline/client/style";

import CCPdfDownloadButton from "./components/CCPdfDownloadButton.vue";
import CCShare from "./components/shortUrl/CCShare.vue";
import CCChapterOverview from "./components/CCChapterOverview.vue";

export default {
  extends: DefaultTheme,
  Layout: layout,
  enhanceApp({ app }: { app: App }) {
    app.component("CCPdfDownloadButton", CCPdfDownloadButton);
    app.component("CCShare", CCShare);
    app.component("CCChapterOverview", CCChapterOverview);
  },
};

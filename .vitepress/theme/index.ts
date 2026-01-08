import DefaultTheme from "vitepress/theme";
import layout from "./layout.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: layout,
};

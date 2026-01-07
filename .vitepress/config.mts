import { defineConfig } from "vitepress";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildNavItems, buildSidebarItems } from "./sidebar";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.resolve(configDir, "..");
const navItems = buildNavItems(contentRoot);
const sidebarItems = buildSidebarItems(contentRoot);

export default defineConfig({
  title: "Anyayay's Chemistry Note",
  description:
    "一个基于中国普通高中教科书的化学笔记项目🧪A chemistry note project based on Chinese high school textbooks",
  lang: "zh-CN",
  head: [
    ["meta", { property: "og:title", content: "Anyayay's Chemistry Note" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "一个基于中国普通高中教科书的化学笔记项目🧪A chemistry note project based on Chinese high school textbooks",
      },
    ],
    ["meta", { property: "og:image", content: "/images/Logo.png" }],
    [
      "script",
      {
        defer: "",
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "8da19a41-3612-4a93-b54e-c53af8df497b",
      },
    ],
  ],
  themeConfig: {
    nav: navItems,
    sidebar: { "/": sidebarItems },
    socialLinks: [
      { icon: "github", link: "https://github.com/Seeridia/Chemistry-Note" },
    ],
    search: {
      provider: "algolia",
      options: {
        appId: "78SSXF876P",
        apiKey: "7d9417f0dc128971ed3eacc5f4fbb2e0",
        indexName: "Chemistry Note",
      },
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2023-present Seeridia",
    },
    editLink: {
      pattern: "https://github.com/Seeridia/Chemistry-Note/edit/master/:path",
    },
  },
  markdown: {
    math: true,
  },
  srcExclude: ["export/**/*", "PDF文件/**/*"],
  lastUpdated: true,
  sitemap: {
    hostname: "https://chemistry-note.seeridia.top",
  },
});

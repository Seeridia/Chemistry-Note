import { defineConfig } from "vitepress";
import type { DefaultTheme } from "vitepress";

const encodeNavItem = (item: DefaultTheme.NavItem): DefaultTheme.NavItem => {
  if ("link" in item && typeof item.link === "string") {
    return { ...item, link: encodeURI(item.link) };
  }

  if ("items" in item && item.items) {
    return {
      ...item,
      items: item.items.map(encodeNavItem),
    } as DefaultTheme.NavItem;
  }

  return item;
};

const encodeItem = (
  item: DefaultTheme.SidebarItem
): DefaultTheme.SidebarItem => ({
  ...item,
  link: item.link ? encodeURI(item.link) : item.link,
  items: item.items ? item.items.map(encodeItem) : item.items,
  collapsed: item.items ? item.collapsed ?? true : undefined,
});

const encodeLinks = (sidebar: DefaultTheme.Sidebar): DefaultTheme.Sidebar => {
  if (Array.isArray(sidebar)) {
    return sidebar.map(encodeItem);
  }

  const multi: DefaultTheme.SidebarMulti = {};

  for (const [key, value] of Object.entries(sidebar)) {
    if (Array.isArray(value)) {
      multi[key] = value.map(encodeItem);
    } else {
      multi[key] = { ...value, items: value.items.map(encodeItem) };
    }
  }

  return multi;
};

const navItems: DefaultTheme.NavItem[] = [
  { text: "首页", link: "/" },
  {
    text: "目录",
    items: [
      { text: "00 说明", link: "/00 说明/目录" },
      {
        text: "01 原子结构与元素性质",
        link: "/01 原子结构与元素性质/01 核外电子排布方式",
      },
      {
        text: "02 微粒间作用力与物质性质",
        link: "/02 微粒间作用力与物质性质/01 晶体与晶胞（基础知识）",
      },
      {
        text: "03 分子空间结构与物质性质",
        link: "/03 分子空间结构与物质性质/01 价层电子对互斥模型",
      },
      {
        text: "04 有机化学基础",
        link: "/04 有机化学基础/01 研究有机化合物的一般方法",
      },
      {
        text: "05 化学物质基本概念",
        link: "/05 化学物质基本概念/01 物质的组成和分类",
      },
      { text: "06 元素及其化合物", link: "/06 元素及其化合物/01 钠及其化合物" },
      { text: "07 化学实验", link: "/07 化学实验/01 实验仪器" },
      {
        text: "08 化学反应能量与速率",
        link: "/08 化学反应能量与速率/01 化学反应速率与限度",
      },
      { text: "09 化学平衡", link: "/09 化学平衡/01 化学平衡状态" },
      {
        text: "10 化学反应的热效应",
        link: "/10 化学反应的热效应/01 反应热与焓变",
      },
    ],
  },
];

const sidebarItems: DefaultTheme.Sidebar = [
  {
    text: "00 说明",
    items: [
      { text: "Readme", link: "/00 说明/Readme" },
      { text: "目录", link: "/00 说明/目录" },
    ],
  },
  {
    text: "01 原子结构与元素性质",
    items: [
      {
        text: "核外电子排布方式",
        link: "/01 原子结构与元素性质/01 核外电子排布方式",
      },
      {
        text: "构造原理、泡利原理、洪特规则",
        link: "/01 原子结构与元素性质/02 构造原理、泡利原理、洪特规则",
      },
      {
        text: "电子排布式与轨道表示式",
        link: "/01 原子结构与元素性质/03 电子排布式与轨道表示式",
      },
      {
        text: "原子结构 元素周期表",
        link: "/01 原子结构与元素性质/04 原子结构 元素周期表",
      },
      {
        text: "电离能 电负性 元素周期律",
        link: "/01 原子结构与元素性质/05 电离能 电负性 元素周期律",
      },
      {
        text: "考点：元素周期律与元素推断",
        link: "/01 原子结构与元素性质/考点 元素周期律与元素推断",
      },
    ],
  },
  {
    text: "02 微粒间作用力与物质性质",
    items: [
      {
        text: "晶体与晶胞（基础知识）",
        link: "/02 微粒间作用力与物质性质/01 晶体与晶胞（基础知识）",
      },
      {
        text: "分子间作用力 分子晶体",
        link: "/02 微粒间作用力与物质性质/02 分子间作用力 分子晶体",
      },
      {
        text: "共价键 共价晶体",
        link: "/02 微粒间作用力与物质性质/03 共价键 共价晶体",
      },
      {
        text: "金属键 金属晶体",
        link: "/02 微粒间作用力与物质性质/04 金属键 金属晶体",
      },
      {
        text: "离子键 离子晶体",
        link: "/02 微粒间作用力与物质性质/05 离子键 离子晶体",
      },
      {
        text: "考点：化学键与相互作用力",
        link: "/02 微粒间作用力与物质性质/考点 化学键与相互作用力",
      },
      {
        text: "考点：晶体结构与性质",
        link: "/02 微粒间作用力与物质性质/考点 晶体结构与性质",
      },
    ],
  },
  {
    text: "03 分子空间结构与物质性质",
    items: [
      {
        text: "价层电子对互斥模型",
        link: "/03 分子空间结构与物质性质/01 价层电子对互斥模型",
      },
      {
        text: "杂化轨道理论",
        link: "/03 分子空间结构与物质性质/02 杂化轨道理论",
      },
      {
        text: "分子的极性 手性分子",
        link: "/03 分子空间结构与物质性质/03 分子的极性 手性分子",
      },
      {
        text: "配位键 配合物",
        link: "/03 分子空间结构与物质性质/04 配位键 配合物",
      },
    ],
  },
  {
    text: "04 有机化学基础",
    items: [
      {
        text: "研究有机化合物的一般方法",
        link: "/04 有机化学基础/01 研究有机化合物的一般方法",
      },
      {
        text: "有机化合物的结构",
        link: "/04 有机化学基础/02 有机化合物的结构",
      },
      {
        text: "有机化合物的分类和命名",
        link: "/04 有机化学基础/03 有机化合物的分类和命名",
      },
      { text: "烃", link: "/04 有机化学基础/04 烃" },
      { text: "烃的衍生物", link: "/04 有机化学基础/05 烃的衍生物" },
      { text: "生物大分子", link: "/04 有机化学基础/06 生物大分子" },
      {
        text: "化学品的合理使用",
        link: "/04 有机化学基础/07 化学品的合理使用",
      },
      { text: "合成高分子", link: "/04 有机化学基础/08 合成高分子" },
      { text: "有机合成进阶", link: "/04 有机化学基础/09 有机合成进阶" },
      {
        text: "考点：有机反应类型梳理",
        link: "/04 有机化学基础/考点 有机反应类型梳理",
      },
      { text: "考点：有机推断", link: "/04 有机化学基础/考点 有机推断" },
    ],
  },
  {
    text: "05 化学物质基本概念",
    items: [
      {
        text: "物质的组成和分类",
        link: "/05 化学物质基本概念/01 物质的组成和分类",
      },
      { text: "物质的计量", link: "/05 化学物质基本概念/02 物质的计量" },
      {
        text: "离子反应 离子方程式",
        link: "/05 化学物质基本概念/03 离子反应 离子方程式",
      },
      {
        text: "离子共存 离子的检验和推断",
        link: "/05 化学物质基本概念/04 离子共存 离子的检验和推断",
      },
      {
        text: "氧化还原反应及其配平",
        link: "/05 化学物质基本概念/05 氧化还原反应及其配平",
      },
      { text: "化学常识", link: "/05 化学物质基本概念/06 化学常识" },
      { text: "化学与 STSE", link: "/05 化学物质基本概念/07 化学与 STSE" },
      {
        text: "考点：离子方程式正误判断",
        link: "/05 化学物质基本概念/考点 离子方程式正误判断",
      },
    ],
  },
  {
    text: "06 元素及其化合物",
    items: [
      { text: "钠及其化合物", link: "/06 元素及其化合物/01 钠及其化合物" },
      { text: "铁及其化合物", link: "/06 元素及其化合物/02 铁及其化合物" },
      { text: "铜及其化合物", link: "/06 元素及其化合物/03 铜及其化合物" },
      { text: "镁及其化合物", link: "/06 元素及其化合物/04 镁及其化合物" },
      { text: "铝及其化合物", link: "/06 元素及其化合物/05 铝及其化合物" },
      { text: "氯与卤族元素", link: "/06 元素及其化合物/06 氯与卤族元素" },
      { text: "氮及其化合物", link: "/06 元素及其化合物/07 氮及其化合物" },
      { text: "硫及其化合物", link: "/06 元素及其化合物/08 硫及其化合物" },
      { text: "硅及其化合物", link: "/06 元素及其化合物/09 硅及其化合物" },
      {
        text: "金属材料与金属矿物开发",
        link: "/06 元素及其化合物/10 金属材料与金属矿物开发",
      },
    ],
  },
  {
    text: "07 化学实验",
    items: [
      { text: "实验仪器", link: "/07 化学实验/01 实验仪器" },
      { text: "实验过程", link: "/07 化学实验/02 实验过程" },
      { text: "常见实验", link: "/07 化学实验/03 常见实验" },
      { text: "文字描述题模板", link: "/07 化学实验/04 文字描述题模板" },
    ],
  },
  {
    text: "08 化学反应能量与速率",
    items: [
      {
        text: "化学反应速率与限度",
        link: "/08 化学反应能量与速率/01 化学反应速率与限度",
      },
      { text: "化学反应速率", link: "/08 化学反应能量与速率/02 化学反应速率" },
    ],
  },
  {
    text: "09 化学平衡",
    items: [{ text: "化学平衡状态", link: "/09 化学平衡/01 化学平衡状态" }],
  },
  {
    text: "10 化学反应的热效应",
    items: [
      { text: "反应热与焓变", link: "/10 化学反应的热效应/01 反应热与焓变" },
    ],
  },
];

export default defineConfig({
  title: "Anyayay's Chemistry Note",
  description:
    "一个基于中国普通高中教科书的化学笔记项目🧪A chemistry note project based on Chinese high school textbooks",
  lang: "zh-CN",
  head: [
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
    nav: navItems.map(encodeNavItem),
    sidebar: encodeLinks({ "/": sidebarItems }),
    socialLinks: [
      { icon: "github", link: "https://github.com/Seeridia/Chemistry-Note" },
    ],
    search: {
      provider: "local",
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
});

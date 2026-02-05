import path from "node:path";
import type { DefaultTheme } from "vitepress";
import { encodeLink, getSectionFiles, getSections } from "./sidebar";

export const buildNavItems = (rootDir: string): DefaultTheme.NavItem[] => {
  const sections = getSections(rootDir);

  const items: DefaultTheme.NavItemWithLink[] = sections.map((sectionName) => {
    const sectionPath = path.join(rootDir, sectionName);
    const files = getSectionFiles(sectionPath);
    const entry = files[0];

    const link = entry
      ? `/${sectionName}/${entry.slice(0, -3)}`
      : `/${sectionName}/`;
    return { text: sectionName, link: encodeLink(link) };
  });

  return [
    { text: "首页", link: "/" },
    {
      text: "目录",
      items,
    },
    {
      text: "分享",
      items: [{ component: "CCShare" }],
    },
    {
      text: "下载",
      items: [{ component: "CCPdfDownloadButton" }],
    },
  ];
};

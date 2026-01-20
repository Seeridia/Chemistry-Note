import fs from "node:fs";
import path from "node:path";
import type { DefaultTheme } from "vitepress";

const sectionDirPattern = /^\d{2}\s/;
const ignoredRootDirs = new Set([
  ".vitepress",
  "node_modules",
  "public",
  "data",
  "hidePage",
  "PDF文件",
]);

const encodeLink = (link: string): string => encodeURI(link);

const getSections = (rootDir: string): string[] =>
  fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        sectionDirPattern.test(dirent.name) &&
        !ignoredRootDirs.has(dirent.name),
    )
    .map((dirent) => dirent.name)
    .sort((a, b) => a.localeCompare(b, "zh-CN"));

const getSectionFiles = (sectionPath: string): string[] =>
  fs
    .readdirSync(sectionPath, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".md"))
    .map((dirent) => dirent.name)
    .sort((a, b) => a.localeCompare(b, "zh-CN"));

// Build sidebar from numbered top-level folders and their markdown files.
export const buildSidebarItems = (
  rootDir: string,
): DefaultTheme.SidebarItem[] => {
  const sections = getSections(rootDir);

  return sections.map((sectionName) => {
    const sectionPath = path.join(rootDir, sectionName);
    const files = getSectionFiles(sectionPath).filter(
      (name) => name.toLowerCase() !== "index.md",
    );

    const items: DefaultTheme.SidebarItem[] = files.map((filename) => {
      const name = filename.slice(0, -3);
      return {
        text: name,
        link: encodeLink(`/${sectionName}/${name}`),
      };
    });

    return {
      text: sectionName,
      items,
      collapsed: true,
    };
  });
};

// Build nav items for top-level sections; prefer 目录.md as entry if present.
export const buildNavItems = (rootDir: string): DefaultTheme.NavItem[] => {
  const sections = getSections(rootDir);

  const items: DefaultTheme.NavItemWithLink[] = sections.map((sectionName) => {
    const sectionPath = path.join(rootDir, sectionName);
    const files = getSectionFiles(sectionPath);
    const entry =
      files.find((name) => name === "目录.md") ??
      files.find((name) => name.toLowerCase() !== "index.md") ??
      files[0];

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
      component: "CCPdfDownloadButton",
    },
  ];
};

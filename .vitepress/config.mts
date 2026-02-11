import { defineConfig } from 'vitepress';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSidebarItems } from './siteData/sidebar';
import { buildNavItems } from './siteData/nav';
import mapShortUrl from './theme/components/shortUrl/mapShortUrl';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.resolve(configDir, '..');
const siteUrl = 'https://chemistry-note.seeridia.top';
const navItems = buildNavItems(contentRoot);
const sidebarItems = buildSidebarItems(contentRoot);

function toPublicPath(relativePath: string): string {
  if (relativePath === 'index.md') return '/';
  return `/${encodeURI(relativePath.replace(/\.md$/i, '.html'))}`;
}

function shouldNoIndex(relativePath: string): boolean {
  const lowerPath = relativePath.toLowerCase();
  return (
    relativePath.startsWith('hidePage/') ||
    relativePath === 's.md' ||
    relativePath === 'README.md' ||
    relativePath === '404.md' ||
    lowerPath.includes('thanksforfeedback')
  );
}

export default defineConfig({
  title: "Anyayay's Chemistry Note",
  description:
    '一个基于中国普通高中教科书的化学笔记项目🧪A chemistry note project based on Chinese high school textbooks',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/images/icon.svg' }],
    ['meta', { property: 'og:title', content: "Anyayay's Chemistry Note" }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          '一个基于中国普通高中教科书的化学笔记项目🧪A chemistry note project based on Chinese high school textbooks',
      },
    ],
    ['meta', { property: 'og:image', content: `${siteUrl}/images/og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/images/og-image.png` }],
    [
      'script',
      {
        defer: '',
        src: 'https://cloud.umami.is/script.js',
        'data-website-id': '8da19a41-3612-4a93-b54e-c53af8df497b',
      },
    ],
  ],
  themeConfig: {
    logo: '/images/icon.svg',
    siteTitle: 'Chemistry Note',
    nav: navItems,
    sidebar: { '/': sidebarItems },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Seeridia/Chemistry-Note' },
    ],
    search: {
      provider: 'algolia',
      options: {
        appId: '78SSXF876P',
        apiKey: '7d9417f0dc128971ed3eacc5f4fbb2e0',
        indexName: 'Chemistry Note',
        askAi: {
          assistantId: 'gGugAZCzGHst',
        },
      },
    },
    editLink: {
      pattern: 'https://github.com/Seeridia/Chemistry-Note/edit/master/:path',
      text: '在 GitHub 上查看此页',
    },
  },
  markdown: {
    math: true,
  },
  rewrites: {
    'hidePage/shortUrl.md': 's.md',
  },
  transformHead({ pageData }) {
    const relativePath = pageData.relativePath;
    const canonicalUrl = `${siteUrl}${toPublicPath(relativePath)}`;
    const tags: [string, Record<string, string>][] = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
    ];

    if (shouldNoIndex(relativePath)) {
      tags.push(['meta', { name: 'robots', content: 'noindex, nofollow' }]);
    }

    return tags;
  },
  lastUpdated: true,
  sitemap: {
    hostname: siteUrl,
    transformItems(items) {
      return items.filter((item) => {
        const url = typeof item === 'string' ? item : String(item.url ?? '');
        if (url.includes('/hidePage/')) return false;
        if (url.endsWith('/README.html')) return false;
        if (url.endsWith('/s.html')) return false;
        return true;
      });
    },
  },

  // 生成哈希 - 路径对应表
  buildEnd: (siteConfig) => {
    mapShortUrl(siteConfig);
  },
});

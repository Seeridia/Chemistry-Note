import type { HeadConfig, TransformContext } from 'vitepress';

function toPublicPath(relativePath: string): string {
  if (relativePath === 'index.md') return '/';
  return `/${encodeURI(relativePath.replace(/\.md$/i, '.html'))}`;
}

function isChapterIndexPath(relativePath: string): boolean {
  return /^\d{2}\s[^/]+\/index\.md$/i.test(relativePath);
}

function toBreadcrumbItemPath(pathParts: string[], index: number): string {
  if (index === 0) {
    return `/${pathParts[0]}/index.html`;
  }
  return `/${pathParts.slice(0, index + 1).join('/')}`;
}

function toBreadcrumbName(input: string): string {
  return input.replace(/^\d+\s*/, '').trim();
}

function normalizeDescription(input?: string): string | undefined {
  if (!input) return undefined;
  const text = input.replace(/\s+/g, ' ').trim();
  if (!text) return undefined;
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

function toIsoDate(input: unknown): string | undefined {
  if (typeof input === 'number') {
    if (input <= 0) return undefined;
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  if (typeof input === 'string' && input.trim()) {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? undefined : input.toISOString();
  }
  return undefined;
}

export function buildTransformHead(siteUrl: string, siteName: string, defaultDescription: string) {
  return function transformHead({ pageData }: TransformContext): HeadConfig[] {
    const relativePath = pageData.relativePath;
    const canonicalUrl = `${siteUrl}${toPublicPath(relativePath)}`;
    const pagePath = toPublicPath(relativePath);
    const pageDescription =
      normalizeDescription(pageData.description) ||
      normalizeDescription(pageData.frontmatter.description as string | undefined) ||
      defaultDescription;
    const pageTitle = pageData.title ? `${pageData.title} | ${siteName}` : siteName;
    const isHomePage = relativePath === 'index.md';
    const is404Page = relativePath === '404.md';
    const isChapterIndex = isChapterIndexPath(relativePath);
    const publishedTime = toIsoDate((pageData.frontmatter as Record<string, unknown>)?.date);
    const modifiedTime =
      toIsoDate((pageData as { lastUpdated?: unknown }).lastUpdated) ||
      toIsoDate((pageData.frontmatter as Record<string, unknown>)?.lastUpdated);

    const websiteJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: `${siteUrl}/`,
      inLanguage: 'zh-CN',
      description: defaultDescription,
    };

    const webPageJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      url: canonicalUrl,
      description: pageDescription,
      isPartOf: {
        '@type': 'WebSite',
        name: siteName,
        url: `${siteUrl}/`,
      },
      inLanguage: 'zh-CN',
    };
    if (publishedTime) {
      Object.assign(webPageJsonLd, { datePublished: publishedTime });
    }
    if (modifiedTime) {
      Object.assign(webPageJsonLd, { dateModified: modifiedTime });
    }

    const pathParts = pagePath
      .replace(/^\/|\/$/g, '')
      .split('/')
      .filter(Boolean);
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: `${siteUrl}/`,
      },
      ...pathParts
        .map((part, index) => {
          const itemPath = toBreadcrumbItemPath(pathParts, index);
          return {
            '@type': 'ListItem',
            position: index + 2,
            name: toBreadcrumbName(decodeURIComponent(part).replace(/\.html$/i, '')),
            item: `${siteUrl}${itemPath}`,
          };
        })
        .filter((item) => item.name.toLowerCase() !== 'index'),
    ];

    const tags: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
      ['script', { type: 'application/ld+json' }, JSON.stringify(webPageJsonLd)],
    ];

    if (isHomePage) {
      tags.push(['script', { type: 'application/ld+json' }, JSON.stringify(websiteJsonLd)]);
    }

    if (breadcrumbItems.length > 1) {
      tags.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems,
        }),
      ]);
    }

    if (!isHomePage && !is404Page && isChapterIndex) {
      const collectionJsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        url: canonicalUrl,
        description: pageDescription,
        inLanguage: 'zh-CN',
        isPartOf: {
          '@type': 'WebSite',
          name: siteName,
          url: `${siteUrl}/`,
        },
      };

      if (publishedTime) {
        collectionJsonLd.datePublished = publishedTime;
      }
      if (modifiedTime) {
        collectionJsonLd.dateModified = modifiedTime;
      }

      tags.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(collectionJsonLd),
      ]);
    }

    if (!isHomePage && !is404Page && !isChapterIndex) {
      const isLearningResource =
        /^\d{2}\s/.test(relativePath) ||
        ['考点', '复习', '实验', '基础', '概念'].some((keyword) =>
          (pageData.title || '').includes(keyword),
        );
      const articleJsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': isLearningResource ? 'LearningResource' : 'Article',
        headline: pageData.title || siteName,
        description: pageDescription,
        url: canonicalUrl,
        inLanguage: 'zh-CN',
        mainEntityOfPage: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Seeridia',
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/images/icon.svg`,
          },
        },
      };

      if (publishedTime) {
        articleJsonLd.datePublished = publishedTime;
      }
      if (modifiedTime) {
        articleJsonLd.dateModified = modifiedTime;
      }
      if (isLearningResource) {
        articleJsonLd.learningResourceType = 'StudyGuide';
        articleJsonLd.educationalLevel = 'High school';
      }

      tags.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(articleJsonLd),
      ]);
    }

    return tags;
  };
}

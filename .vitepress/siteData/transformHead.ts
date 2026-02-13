import type { HeadConfig, TransformContext } from 'vitepress';

function toPublicPath(relativePath: string): string {
  if (relativePath === 'index.md') return '/';
  return `/${encodeURI(relativePath.replace(/\.md$/i, '.html'))}`;
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
    const breadcrumbItems = pathParts.map((part, index) => {
      const itemPath = `/${pathParts.slice(0, index + 1).join('/')}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: toBreadcrumbName(decodeURIComponent(part).replace(/\.html$/i, '')),
        item: `${siteUrl}${itemPath}`,
      };
    });

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

    if (!isHomePage && !is404Page) {
      const techArticleJsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
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
        techArticleJsonLd.datePublished = publishedTime;
      }
      if (modifiedTime) {
        techArticleJsonLd.dateModified = modifiedTime;
      }

      tags.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(techArticleJsonLd),
      ]);
    }

    return tags;
  };
}

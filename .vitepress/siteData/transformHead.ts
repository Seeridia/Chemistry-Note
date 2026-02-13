import type { HeadConfig, TransformContext } from 'vitepress';

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

function normalizeDescription(input?: string): string | undefined {
  if (!input) return undefined;
  const text = input.replace(/\s+/g, ' ').trim();
  if (!text) return undefined;
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

export function buildTransformHead(siteUrl: string, siteName: string, defaultDescription: string) {
  return function transformHead({ pageData }: TransformContext): HeadConfig[] {
    const relativePath = pageData.relativePath;
    const canonicalUrl = `${siteUrl}${toPublicPath(relativePath)}`;
    const pageDescription =
      normalizeDescription(pageData.description) ||
      normalizeDescription(pageData.frontmatter.description as string | undefined) ||
      defaultDescription;
    const pageTitle = pageData.title ? `${pageData.title} | ${siteName}` : siteName;
    const tags: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
    ];

    if (shouldNoIndex(relativePath)) {
      tags.push(['meta', { name: 'robots', content: 'noindex, nofollow' }]);
    }

    return tags;
  };
}

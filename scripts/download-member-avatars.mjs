import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const membersPath = path.join(projectRoot, 'data', 'members.json');
const outputDir = path.join(projectRoot, 'public', 'images', 'members');
const manifestPath = path.join(
  projectRoot,
  'data',
  'generated',
  'members-avatar-manifest.json',
);

const EXTENSION_BY_CONTENT_TYPE = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'member';
}

function getExtension(url, contentType) {
  if (contentType) {
    const normalized = contentType.split(';')[0].trim().toLowerCase();
    if (EXTENSION_BY_CONTENT_TYPE[normalized]) {
      return EXTENSION_BY_CONTENT_TYPE[normalized];
    }
  }

  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname);
    return ext || '.png';
  } catch {
    return '.png';
  }
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Chemistry-Note avatar downloader',
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const membersRaw = await fs.readFile(membersPath, 'utf8');
  const membersData = JSON.parse(membersRaw);
  const members = Array.isArray(membersData.members) ? membersData.members : [];

  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });

  const manifest = {};

  for (const [index, member] of members.entries()) {
    if (!member?.avatar || typeof member.avatar !== 'string') {
      continue;
    }

    const sourceUrl = member.avatar;
    const baseName = `${String(index + 1).padStart(2, '0')}-${slugify(member.name ?? 'member')}`;

    try {
      const response = await fetchWithTimeout(sourceUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      const extension = getExtension(sourceUrl, contentType);
      const fileName = `${baseName}${extension}`;
      const filePath = path.join(outputDir, fileName);
      const buffer = Buffer.from(await response.arrayBuffer());

      await fs.writeFile(filePath, buffer);
      manifest[sourceUrl] = `/images/members/${fileName}`;
      console.log(`downloaded: ${member.name} -> ${fileName}`);
    } catch (error) {
      manifest[sourceUrl] = sourceUrl;
      console.warn(`failed: ${member.name} -> ${sourceUrl}`);
      console.warn(error instanceof Error ? error.message : String(error));
    }
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`manifest written: ${path.relative(projectRoot, manifestPath)}`);
}

await main();

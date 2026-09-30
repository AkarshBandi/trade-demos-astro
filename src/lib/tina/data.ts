import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../../tina/__generated__/client';
import { parse as yamlParse } from 'yaml';

// Bundle raw MDX at build time for Cloudflare Workers (no fs at runtime)
import homeRaw from '../../content/page/home.mdx?raw';
import hvacRaw from '../../content/page/hvac.mdx?raw';
import roofingRaw from '../../content/page/roofing.mdx?raw';
import configJson from '../../content/config/config.json';

const rawMap: Record<string, string> = {
  home: homeRaw as any,
  hvac: hvacRaw as any,
  roofing: roofingRaw as any,
};

function parseMDX(raw: string): any {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return {};
  try {
    const fm = yamlParse(m[1]) as any;
    return fm;
  } catch (e) {
    console.warn('yaml parse failed', e);
    return {};
  }
}

function getRawPage(slug: string): any | null {
  const raw = rawMap[slug];
  if (!raw) return null;
  const fm = parseMDX(raw);
  fm._sys = { filename: slug, basename: slug, relativePath: `${slug}.mdx`, path: `src/content/page/${slug}.mdx`, extension: '.mdx' };
  fm.id = `page:${slug}`;
  return fm;
}

export const getConfig = async () => {
  try {
    const r = await requestWithMetadata(client.queries.config({ relativePath: 'config.json' }));
    if (r?.data?.config) return r;
  } catch {}
  const json = configJson as any;
  return requestWithMetadata(Promise.resolve({ data: { config: json }, query: '', variables: {} } as any));
};

export const getPage = async (slug: string) => {
  try {
    const r = await requestWithMetadata(client.queries.page({ relativePath: `${slug}.mdx` }), { priority: 'primary' });
    if (r?.data?.page) return r;
  } catch {}
  const fm = getRawPage(slug);
  if (!fm) {
    return requestWithMetadata(Promise.resolve({ data: { page: null }, query: '', variables: {} } as any), { priority: 'primary' });
  }
  return requestWithMetadata(Promise.resolve({ data: { page: fm }, query: '', variables: { relativePath: `${slug}.mdx` } } as any), { priority: 'primary' });
};

export const getBlog = (slug: string) =>
  requestWithMetadata(client.queries.blog({ relativePath: `${slug}.mdx` }), { priority: 'primary' });

export async function listPages() {
  try {
    const r = await client.queries.pageConnection();
    const edges = (r.data.pageConnection.edges ?? []).flatMap((e: any) => (e?.node ? [e.node] : []));
    if (edges.length > 0) return edges;
  } catch {}
  return Object.keys(rawMap).map((slug) => {
    const fm = parseMDX(rawMap[slug] as any);
    return {
      _sys: { filename: slug, relativePath: `${slug}.mdx`, path: `src/content/page/${slug}.mdx`, extension: '.mdx' },
      id: `page:${slug}`,
      ...fm,
    } as any;
  });
}

export async function listBlogs() {
  try {
    const r = await client.queries.blogConnection();
    return (r.data.blogConnection.edges ?? [])
      .flatMap((e: any) => (e?.node ? [e.node] : []))
      .sort((a: any, b: any) => {
        const ad = a?.pubDate ? new Date(a.pubDate).valueOf() : 0;
        const bd = b?.pubDate ? new Date(b.pubDate).valueOf() : 0;
        return bd - ad;
      });
  } catch {
    return [];
  }
}

export type CmsConfig = Awaited<ReturnType<typeof getConfig>>['data']['config'];
export type CmsPage = Awaited<ReturnType<typeof getPage>>['data']['page'];
export type CmsBlog = Awaited<ReturnType<typeof getBlog>>['data']['blog'];

export type PageBlock = NonNullable<NonNullable<CmsPage['blocks']>[number]>;

import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import reactRenderer from '@astrojs/react/server.js';
import { islands } from '../../lib/tina/islands';

// Internal helpers duplicated from @tinacms/astro to allow adding react renderer
const PREVIEW_CONTENT_TYPE = 'application/x-tina-preview+json';
const PRIME_HEADER = 'x-tina-prime';

function escapeAttr(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

import { AsyncLocalStorage } from 'node:async_hooks';
const STORE_KEY = Symbol.for('@tinacms/astro/forms-store');
const slot: any = globalThis as any;
const formsStore: AsyncLocalStorage<any[]> = (slot[STORE_KEY] ??= new AsyncLocalStorage());
const STORE_KEY2 = Symbol.for('@tinacms/astro/request-context');
const slot2: any = globalThis as any;
const requestStore: AsyncLocalStorage<Request> = (slot2[STORE_KEY2] ??= new AsyncLocalStorage());

function sortByPriority(forms: any[]) {
  return [...forms].sort((a, b) => (a.priority === 'primary' ? 0 : 1) - (b.priority === 'primary' ? 0 : 1));
}
function renderFormPayloadDiv(form: any, primary: boolean) {
  return `<div data-tina-form="${escapeAttr(JSON.stringify(form))}"${primary ? ' data-tina-primary' : ''} hidden></div>`;
}
function renderFormPayloads(forms: any[]) {
  return sortByPriority(forms).map((f) => renderFormPayloadDiv(f, f.priority === 'primary')).join('');
}
function wrapIsland(html: string, wrapper: any, url: URL) {
  const cls = wrapper.className ? ` class="${escapeAttr(wrapper.className)}"` : '';
  const marker = escapeAttr(`${url.pathname}${url.search}`);
  return `<${wrapper.tag}${cls} data-tina-island="${marker}">${html}</${wrapper.tag}>`;
}
function rejectIfUnsafe(request: Request) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const ct = request.headers.get('content-type') ?? '';
  if (!ct.includes(PREVIEW_CONTENT_TYPE)) return new Response('Not Found', { status: 404 });
  if (request.headers.get('sec-fetch-site') === 'cross-site') return new Response('Forbidden', { status: 403 });
  return null;
}

export const prerender = false;

export const ALL: APIRoute = async ({ params, request, url }) => {
  const rejection = rejectIfUnsafe(request);
  if (rejection) return rejection;
  const island = (islands as any)[params.name ?? ''];
  if (!island) return new Response(`Unknown island "${params.name}"`, { status: 404 });
  const priming = request.headers.get(PRIME_HEADER) !== null;
  try {
    const forms: any[] = [];
    const html = await (requestStore as any).run(request, () =>
      (formsStore as any).run(forms, async () => {
        const data = await island.fetch(request, url.searchParams);
        const container = await AstroContainer.create();
        // Critical: register React renderer so any React island does not 500
        (container as any).addServerRenderer({ name: '@astrojs/react', renderer: reactRenderer });
        return (container as any).renderToString(island.component, {
          props: island.propsFromData(data, url.searchParams),
        });
      })
    );
    const body = (priming ? renderFormPayloads(forms) : '') + wrapIsland(html, island.wrapper, url);
    return new Response(body, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    console.error('Island render failed', e);
    return new Response('Island render failed', { status: 500 });
  }
};

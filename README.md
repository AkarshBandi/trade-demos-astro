# TinaCMS + Astro Blocks Starter — Reusable

Generic, site-agnostic blocks template. Build once, reuse per site by editing **one registry file**. Visual editing is pre-wired per `docs.astro.build/en/guides/cms/tina-cms/` + `tina.io/docs/contextual-editing/astro`. All 8 blocks are fully editable (every text/number/image has `tinaField`).

## Quick start

```bash
pnpm install
pnpm dev              # http://localhost:4321 + http://localhost:4321/admin
# edit content
pnpm build            # tinacms build && astro build
npx wrangler deploy   # or pnpm preview
```

Set `.env` from `.env.example` before `pnpm dev/build` when using TinaCloud. Without TinaCloud, use `pnpm build:local`.

## How to use for a new site

1. **Pick block types** — edit **one file** `src/lib/tina/blocks-registry.ts`:
   ```ts
   import Hero from '../components/blocks/Hero.astro'
   import MyBlock from '../components/blocks/MyBlock.astro'
   export const blockRegistry = new Map([['hero', Hero], ['myBlock', MyBlock]])
   ```
2. **Add a block** — create 2 files: `src/components/blocks/MyBlock.template.ts` (Tina `Template` schema) + `src/components/blocks/MyBlock.astro` (renderer with `tinaField`). The dispatcher `src/components/blocks/Blocks.astro` auto-picks it up via `__typename`.
3. **Add content** — `src/content/page/home.mdx` `blocks: [{_template:'hero', headline:'…'}]` + `src/content/config/config.json` (global) + `src/content/blog/*.mdx`.
4. No hardcoded site strings — all copy/images live in `src/content` frontmatter.

## Architecture

* `tina/config.ts` → 3 collections: `Page(blocks)` `Blog(isTitle/isBody)` `Global(ui.global)`
* `src/lib/tina/data.ts` → `requestWithMetadata` per collection (`priority:'primary'` only for pages)
* `src/lib/tina/islands.ts` → `IslandRegistry` `page|blog|global|global-footer`
* `src/pages/tina-island/[name].ts` → `experimental_createIslandRoute(islands)` `prerender:false`
* `src/layouts/Base.astro` → wraps `Header`/`Footer` in `TinaIsland` `global` islands
* `src/pages/index.astro` (`slug=home`) + `src/pages/[...slug].astro` (catch-all) → `page` island `primary`
* `public/js/tina-guard.js` → edit-mode guard (disables Lenis/GSAP, re-reveals swapped islands)

## Why it’s fast

`output: 'static'` with `prerender:true` on pages + `prerender:false` on the island route → static CDN HTML for every page, only `POST /tina-island/*` is dynamic. Build prerenders in ~6s; runtime TTFB is edge-cached.

## Deploy

* Cloudflare Workers: `npx wrangler deploy` (set `PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `SITE_URL` in dashboard)
* Also works with `adapter: vercel()` / `netlify()` / `node()` via swapping `astro.config.mjs` `adapter`.

## Docs

* https://docs.astro.build/en/guides/cms/tina-cms/
* https://tina.io/docs/contextual-editing/astro
* https://tina.io/docs/reference/collections / templates / object
* https://github.com/tinacms/tina-astro-starter

import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { CmsPage, CmsConfig } from './data';
import PageBody from '../../components/islands/PageBody.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import { getPage, getConfig } from './data';

export const islands: IslandRegistry = {
  page: {
    fetch: (_request, params) => getPage(params.get('slug') ?? 'home'),
    component: PageBody,
    wrapper: { tag: 'main' },
    propsFromData: (data) => ({
      data: (data as QueryResult<PageQuery>).data?.page as CmsPage | undefined,
    }),
  },
  global: {
    fetch: () => getConfig(),
    component: Header,
    wrapper: { tag: 'div' },
    propsFromData: (data) => ({
      config: (data as QueryResult<ConfigQuery>).data?.config as CmsConfig | undefined,
    }),
  },
  'global-footer': {
    fetch: () => getConfig(),
    component: Footer,
    wrapper: { tag: 'div' },
    propsFromData: (data) => ({
      config: (data as QueryResult<ConfigQuery>).data?.config as CmsConfig | undefined,
    }),
  },
};

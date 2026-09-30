import { defineConfig } from 'tinacms';
import { PageCollection } from './collections/page';
import { GlobalCollection } from './collections/global';

// Standardise on 'main' (PRECAUTIONS.md 2). Both other Tina projects index
// 'main' and their editors resolve; this one was on 'master' and returned an
// empty content store, so the admin rendered the collection with no documents.
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.WORKERS_CI_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [PageCollection, GlobalCollection],
  },
});

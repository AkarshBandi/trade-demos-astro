import { defineConfig } from 'tinacms';
import { PageCollection } from './collections/page';
import { GlobalCollection } from './collections/global';

// 'master', NOT 'main'. The CI vars above are set by whichever host runs the
// build, and this fallback is what a LOCAL `tinacms build` uses. It was
// 'main', which is not a branch that exists in this repository — so a local
// build would sync against a non-existent branch and the CMS would show stale
// or empty content, which reads as "my credentials are wrong" and is not.
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.WORKERS_CI_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  'master';

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

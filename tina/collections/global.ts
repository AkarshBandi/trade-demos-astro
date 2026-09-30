import type { Collection } from 'tinacms';

const linkFields = [
  { name: 'title', label: 'Title', type: 'string' as const, required: true },
  { name: 'link', label: 'Link', type: 'string' as const, required: true },
];

export const GlobalCollection: Collection = {
  name: 'config',
  label: 'Global config',
  path: 'src/content/config',
  format: 'json',
  ui: { global: true },
  fields: [
    {
      name: 'seo',
      label: 'Site identity & SEO',
      type: 'object',
      fields: [
        { name: 'title', label: 'Site name', type: 'string', required: true },
        { name: 'description', label: 'Default meta description', type: 'string', required: true },
      ],
    },
    {
      name: 'header',
      label: 'Header',
      type: 'object',
      fields: [
        { name: 'wordmark', label: 'Wordmark', type: 'string' },
        { name: 'wordmarkSub', label: 'Wordmark sub-line', type: 'string' },
        { name: 'badge', label: 'Wordmark badge', type: 'string' },
        { name: 'menuLabel', label: 'Mobile menu button label', type: 'string' },
        {
          name: 'nav',
          label: 'Navigation menu',
          type: 'object',
          list: true,
          ui: { itemProps: (item: { title?: string }) => ({ label: item?.title ?? 'Link' }) },
          fields: linkFields,
        },
        {
          name: 'actions',
          label: 'Header buttons',
          type: 'object',
          list: true,
          ui: { itemProps: (item: { label?: string }) => ({ label: item?.label ?? 'Button' }) },
          fields: [
            { name: 'label', label: 'Label', type: 'string' },
            { name: 'link', label: 'Link', type: 'string' },
            { name: 'variant', label: 'Variant', type: 'string', options: ['ghost', 'solid'] },
          ],
        },
      ],
    },
    {
      name: 'footer',
      label: 'Footer',
      type: 'object',
      fields: [
        { name: 'wordmark', label: 'Footer wordmark', type: 'string' },
        { name: 'wordmarkSub', label: 'Footer wordmark sub-line', type: 'string' },
        { name: 'blurb', label: 'Footer blurb', type: 'string', ui: { component: 'textarea' } },
        {
          name: 'columns',
          label: 'Footer link columns',
          type: 'object',
          list: true,
          ui: { itemProps: (item: { heading?: string }) => ({ label: item?.heading ?? 'Column' }) },
          fields: [
            { name: 'heading', label: 'Heading', type: 'string' },
            {
              name: 'links',
              label: 'Links',
              type: 'object',
              list: true,
              ui: { itemProps: (item: { title?: string }) => ({ label: item?.title ?? 'Link' }) },
              fields: linkFields,
            },
          ],
        },
        { name: 'footerNote', label: 'Footer note (left)', type: 'string' },
        { name: 'credit', label: 'Footer credit (right)', type: 'string' },
      ],
    },
  ],
};

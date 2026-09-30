import type { Template } from 'tinacms';

export const richTextBlockSchema: Template = {
  name: 'richText',
  label: 'Rich text',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline', name: 'headline' },
    { type: 'string', label: 'Body', name: 'body', ui: { component: 'textarea' } },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'Section label',
      headline: 'Rich text headline',
      body: 'Body content with **markdown** support.',
    },
  },
};

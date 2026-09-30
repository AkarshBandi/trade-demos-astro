import type { Template } from 'tinacms';

export const pricingBlockSchema: Template = {
  name: 'pricing',
  label: 'Pricing (3 tiers)',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline', name: 'headline' },
    { type: 'string', label: 'Subhead', name: 'subhead', ui: { component: 'textarea' } },
    { type: 'string', label: 'Accent (brick/copper)', name: 'accent' },
    {
      type: 'object',
      label: 'Tiers',
      name: 'tiers',
      list: true,
      ui: { defaultItem: { title: 'Essential', price: '$19/mo', priceNote: 'From $228/yr', desc: '2× tune-ups, filter, 15% off' } },
      fields: [
        { type: 'string', label: 'Title', name: 'title' },
        { type: 'string', label: 'Price', name: 'price' },
        { type: 'string', label: 'Price note', name: 'priceNote' },
        { type: 'string', label: 'Description', name: 'desc', ui: { component: 'textarea' } },
        { type: 'string', label: 'Bullets', name: 'bullets', list: true },
        { type: 'boolean', label: 'Featured (Most popular)', name: 'featured' },
        { type: 'string', label: 'CTA label', name: 'ctaLabel' },
        { type: 'string', label: 'CTA link', name: 'ctaLink' },
      ],
    },
    { type: 'string', label: 'Fine print', name: 'fine' },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'Maintenance program',
      headline: 'Keep it running, keep it covered',
      subhead: 'Scope, price-from, duration — plain.',
      tiers: [
        { title: 'Essential', price: '$19/mo', priceNote: 'From $228/yr', desc: '2× tune-ups, filter, 15% off', bullets: ['AC + furnace check', 'Filter included', 'Priority scheduling'], featured: false, ctaLabel: 'See what’s included' },
        { title: 'Plus', price: '$39/mo', priceNote: 'From $468/yr', desc: 'Coil clean, 20% off, no OT fee', bullets: ['Coil cleaning', 'No overtime fee', '20% off repairs'], featured: true, ctaLabel: 'See what’s included' },
        { title: 'Complete', price: '$59/mo', priceNote: 'From $708/yr', desc: 'IAQ check, wash, loaner if delayed', bullets: ['IAQ check', 'Condenser wash', 'Loaner unit'], featured: false, ctaLabel: 'See what’s included' },
      ],
    },
  },
};

import type { HeadConfig } from 'vitepress';
import { ORGANIZATION, REPOSITORY, API_DOCS } from '../constants';

export const head: HeadConfig[] = [
  ['link', { rel: 'icon', type: 'image/svg+xml', href: '/omos-logo.png' }],
  ['meta', { name: 'theme-color', content: '#3451b2' }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:title', content: REPOSITORY.NAME }],
  [
    'meta',
    {
      property: 'og:description',
      content: `Open source University Data Platform by ${ORGANIZATION.NAME} - Docs, ${API_DOCS.MAIN_TITLE} & Project Specifications`,
    },
  ],
];

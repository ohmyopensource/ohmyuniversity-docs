import type { DefaultTheme } from 'vitepress';
import { COMMON_LINKS, COMMON_TITLES } from '../../constants';

export const guidesSidebar: DefaultTheme.SidebarMulti = {
  // ================================
  // GUIDES
  // ================================
  '/guides/': [
    {
      text: COMMON_TITLES.GUIDES,
      items: [
        {
          text: 'Data Sources Overview',
          link: `/${COMMON_LINKS.GUIDES}/data-sources-overview`,
        },
        {
          text: 'API Usage Patterns',
          link: `/${COMMON_LINKS.GUIDES}/api-usage-patterns`,
        },
      ],
    },
    {
      text: 'Data Sources',
      collapsed: false,
      items: [
        {
          text: 'CINECA Data Guide',
          link: `/${COMMON_LINKS.GUIDES}/cineca-data-guide`,
        },
        {
          text: 'MIUR Data Guide',
          link: `/${COMMON_LINKS.GUIDES}/miur-data-guide`,
        },
        {
          text: 'European Data Portal Guide',
          link: `/${COMMON_LINKS.GUIDES}/european-data-portal-guide`,
        },
      ],
    },
    {
      text: 'Data Engineering',
      collapsed: false,
      items: [
        {
          text: 'Common Data Issues',
          link: `/${COMMON_LINKS.GUIDES}/common-data-issues`,
        },
        {
          text: 'Data Cleaning Strategies',
          link: `/${COMMON_LINKS.GUIDES}/data-cleaning-strategies`,
        },
        {
          text: 'Dataset Normalization',
          link: `/${COMMON_LINKS.GUIDES}/dataset-normalization`,
        },
        {
          text: 'Mapping University Codes',
          link: `/${COMMON_LINKS.GUIDES}/mapping-university-codes`,
        },
        {
          text: 'Year Aggregation Rules',
          link: `/${COMMON_LINKS.GUIDES}/year-aggregation-rules`,
        },
      ],
    },
  ],
};

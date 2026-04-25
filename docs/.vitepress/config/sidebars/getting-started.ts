import type { DefaultTheme } from 'vitepress';
import { COMMON_LINKS, COMMON_TITLES } from '../../constants';

export const gettingStartedSidebar: DefaultTheme.SidebarMulti = {
  // ================================
  // GETTING STARTED
  // ================================
  '/getting-started/': [
    {
      text: COMMON_TITLES.GETTING_STARTED,
      items: [
        {
          text: 'Overview',
          link: `/${COMMON_LINKS.GETTING_STARTED}/${COMMON_LINKS.OVERVIEW}`,
        },
        { text: 'Setup', link: `/${COMMON_LINKS.GETTING_STARTED}/setup` },
        {
          text: 'API Quickstart',
          link: `/${COMMON_LINKS.GETTING_STARTED}/api`,
        },
        {
          text: 'Contributing',
          link: `/${COMMON_LINKS.GETTING_STARTED}/contribute`,
        },
      ],
    },
  ],

  // ================================
  // ARCHITECTURE
  // ================================
  '/architecture/': [
    {
      text: COMMON_TITLES.ARCHITECTURE,
      items: [
        {
          text: 'Overview',
          link: `/architecture/${COMMON_LINKS.OVERVIEW}`,
        },
        { text: 'System Context', link: '/architecture/system-context' },
      ],
    },
    {
      text: 'API Backend',
      collapsed: false,
      items: [
        {
          text: 'Overview',
          link: `/architecture/api/${COMMON_LINKS.OVERVIEW}`,
        },
        { text: 'API Design', link: '/architecture/api/api-design' },
        {
          text: COMMON_TITLES.ARCHITECTURE,
          link: '/architecture/api/architecture',
        },
        { text: 'Authentication', link: '/architecture/api/auth' },
        { text: 'Database', link: '/architecture/api/database' },
      ],
    },
    {
      text: 'Web App',
      collapsed: false,
      items: [
        {
          text: 'Overview',
          link: `/architecture/web/${COMMON_LINKS.OVERVIEW}`,
        },
        {
          text: COMMON_TITLES.ARCHITECTURE,
          link: '/architecture/web/architecture',
        },
        {
          text: 'State Management',
          link: '/architecture/web/state-management',
        },
        {
          text: 'Build & Deployment',
          link: '/architecture/web/build-deployment',
        },
      ],
    },
    {
      text: 'Mobile App',
      collapsed: true,
      items: [
        {
          text: 'Overview',
          link: `/architecture/mobile/${COMMON_LINKS.OVERVIEW}`,
        },
        {
          text: COMMON_TITLES.ARCHITECTURE,
          link: '/architecture/mobile/architecture',
        },
        {
          text: 'State & Navigation',
          link: '/architecture/mobile/state-navigation',
        },
        {
          text: 'Build & Release',
          link: '/architecture/mobile/build-release',
        },
      ],
    },
    {
      text: 'Desktop App',
      collapsed: true,
      items: [
        {
          text: 'Overview',
          link: `/architecture/desktop/${COMMON_LINKS.OVERVIEW}`,
        },
        {
          text: COMMON_TITLES.ARCHITECTURE,
          link: '/architecture/desktop/architecture',
        },
        { text: 'Packaging', link: '/architecture/desktop/packaging' },
      ],
    },
    {
      text: 'Shared',
      collapsed: true,
      items: [
        {
          text: 'API Contracts',
          link: '/architecture/shared/api-contracts',
        },
        { text: 'Conventions', link: '/architecture/shared/conventions' },
        { text: 'Data Models', link: '/architecture/shared/data-models' },
      ],
    },
  ],
};

import { defineConfig } from 'vitepress';
import { ORGANIZATION, REPOSITORY, API_DOCS } from './constants';
import { head } from './config/head';
import { nav } from './config/nav';
import {
  socialLinks,
  footer,
  editLink,
  search,
  lastUpdated,
  docFooter,
  outline,
} from './config/extras';
import { sidebar } from './config/sidebars';

export default defineConfig({
  title: REPOSITORY.NAME,
  description: `Open source University Data Platform by ${ORGANIZATION.NAME} - Docs, ${API_DOCS.MAIN_TITLE} & Project Specifications`,
  lang: 'en-US',

  srcDir: '.',
  outDir: '../dist',
  cleanUrls: true,

  sitemap: {
    hostname: 'https://docs.university.ohmyopensource.org',
  },

  head,

  themeConfig: {
    logo: '/omos-logo.png',
    siteTitle: REPOSITORY.NAME,

    nav,
    sidebar,
    socialLinks,
    footer,
    editLink,
    search,
    lastUpdated,
    docFooter,
    outline,

    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
  },
});

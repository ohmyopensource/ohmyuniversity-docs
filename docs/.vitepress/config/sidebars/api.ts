import type { DefaultTheme } from 'vitepress';
import { API_DOCS, COMMON_LINKS } from '../../constants';

// ================================
// SHARED BACK LINK
// ================================
const backToApiDocs = {
  text: '< API Docs',
  link: `${API_DOCS.BASE_URL}/${COMMON_LINKS.OVERVIEW}`,
};

// ================================
// API DOCS ROOT
// ================================
const apiRootSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: API_DOCS.MAIN_TITLE,
    items: [
      {
        text: 'Overview',
        link: `${API_DOCS.BASE_URL}/${COMMON_LINKS.OVERVIEW}`,
      },
      {
        text: 'Conventions',
        link: `${API_DOCS.BASE_URL}/conventions`,
      },
    ],
  },
  {
    text: 'Internal APIs',
    items: [
      {
        text: 'App Private APIs',
        link: `${API_DOCS.BASE_URL}/int-private/${COMMON_LINKS.OVERVIEW}`,
      },
    ],
  },
  {
    text: 'External APIs',
    items: [
      {
        text: 'ESSE3/CINECA',
        link: `${API_DOCS.BASE_URL}/cineca/${COMMON_LINKS.OVERVIEW}`,
      },
      {
        text: 'MIUR',
        link: `${API_DOCS.BASE_URL}/miur/${COMMON_LINKS.OVERVIEW}`,
      },
      {
        text: 'European Data Portal',
        link: `${API_DOCS.BASE_URL}/european-data-portal/${COMMON_LINKS.OVERVIEW}`,
      },
    ],
  },
];

// ================================
// CINECA
// ================================
const cinecaSidebar: DefaultTheme.SidebarItem[] = [
  backToApiDocs,
  {
    text: 'ESSE3/CINECA',
    items: [
      {
        text: 'Overview',
        link: `${API_DOCS.BASE_URL}/cineca/${COMMON_LINKS.OVERVIEW}`,
      },
      {
        text: 'Authentication',
        link: `${API_DOCS.BASE_URL}/cineca/auth`,
      },
      {
        text: 'Changelog',
        link: `${API_DOCS.BASE_URL}/cineca/changelog`,
      },
    ],
  },
  {
    text: 'API Common',
    collapsed: true,
    items: [
      {
        text: 'Overview',
        link: `${API_DOCS.BASE_URL}/cineca/api-common/${COMMON_LINKS.OVERVIEW}`,
      },
    ],
  },
  {
    text: 'API Unimol',
    collapsed: true,
    items: [
      {
        text: 'Aggiorna Carriere',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/aggcarr-api-v1`,
      },
      {
        text: 'Allegati',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/allegati-api-v1`,
      },
      {
        text: 'Anagrafica',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/anagrafica-api-v2`,
      },
      {
        text: 'Auth',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/auth-api-v1`,
      },
      {
        text: 'Badge',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/badge-api-v1`,
      },
      {
        text: 'Calendario Appuntamenti',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/calendario-appuntamenti-api-v1`,
      },
      {
        text: 'Calesa',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/calesa-api-v1`,
      },
      {
        text: 'Carriere',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/carriere-api-v1`,
      },
      {
        text: 'Comunicazioni',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/comunicazioni-api-v1`,
      },
      {
        text: 'Concorsi',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/concorsi-api-v2`,
      },
      {
        text: 'Conseguimento Titolo',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/conseguimento-titolo-api-v1`,
      },
      {
        text: 'Docenti',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/docenti-api-v1`,
      },
      {
        text: 'Import Badge',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/import-badge-api-v1`,
      },
      {
        text: 'Libretto',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/libretto-api-v2`,
      },
      {
        text: 'Logging',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/logging-api-v1`,
      },
      {
        text: 'Logistica',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/logistica-api-v1`,
      },
      {
        text: 'Nazioni',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/nazioni-api-v1`,
      },
      {
        text: 'Offerta',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/offerta-api-v1`,
      },
      {
        text: 'Piani',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/piani-api-v1`,
      },
      {
        text: 'Questionari',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/questionari-api-v1`,
      },
      {
        text: 'Regpds',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/regpds-api-v1`,
      },
      {
        text: 'Regprop',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/regprop-api-v1`,
      },
      {
        text: 'Regsce',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/regsce-api-v1`,
      },
      {
        text: 'Rendicontazione Doc',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/rendicontazione-doc-api-v1`,
      },
      {
        text: 'Servizi',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/servizi-api-v1`,
      },
      {
        text: 'Struttura',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/struttura-api-v1`,
      },
      {
        text: 'Tasse',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/tasse-api-v1`,
      },
      {
        text: 'Tirocini',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/tirocini-api-v1`,
      },
      {
        text: 'Utenti',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/utenti-api-v1`,
      },
      {
        text: 'Verbali',
        link: `${API_DOCS.BASE_URL}/cineca/api-unimol/verbali-api-v1`,
      },
    ],
  },
];

// ================================
// MIUR
// ================================
const miurSidebar: DefaultTheme.SidebarItem[] = [
  backToApiDocs,
  {
    text: 'MIUR',
    items: [
      {
        text: 'Overview',
        link: `${API_DOCS.BASE_URL}/miur/${COMMON_LINKS.OVERVIEW}`,
      },
    ],
  },
  {
    text: 'Reference',
    collapsed: true,
    items: [
      {
        text: 'Authentication',
        link: `${API_DOCS.BASE_URL}/miur/auth`,
      },
      {
        text: 'Endpoints',
        link: `${API_DOCS.BASE_URL}/miur/endpoints`,
      },
      {
        text: 'Datasets',
        link: `${API_DOCS.BASE_URL}/miur/datasets`,
      },
      {
        text: 'Changelog',
        link: `${API_DOCS.BASE_URL}/miur/changelog`,
      },
    ],
  },
];

// ================================
// EUROPEAN DATA PORTAL
// ================================
const europeanDataPortalSidebar: DefaultTheme.SidebarItem[] = [
  backToApiDocs,
  {
    text: 'European Data Portal',
    items: [
      {
        text: 'Overview',
        link: `${API_DOCS.BASE_URL}/european-data-portal/${COMMON_LINKS.OVERVIEW}`,
      },
    ],
  },
  {
    text: 'Reference',
    collapsed: true,
    items: [
      {
        text: 'Authentication',
        link: `${API_DOCS.BASE_URL}/european-data-portal/auth`,
      },
      {
        text: 'Endpoints',
        link: `${API_DOCS.BASE_URL}/european-data-portal/endpoints`,
      },
      {
        text: 'Changelog',
        link: `${API_DOCS.BASE_URL}/european-data-portal/changelog`,
      },
    ],
  },
];

// ================================
// APP PRIVATE APIs
// ================================
const privateApiSidebar: DefaultTheme.SidebarItem[] = [
  backToApiDocs,
  {
    text: 'App Private APIs',
    items: [
      {
        text: 'Overview',
        link: `${API_DOCS.BASE_URL}/int-private/${COMMON_LINKS.OVERVIEW}`,
      },
    ],
  },
];

// ================================
// EXPORT
// ================================
export const apiSidebar: DefaultTheme.SidebarMulti = {
  '/api/cineca/api-unimol/': cinecaSidebar,
  '/api/cineca/api-common/': cinecaSidebar,
  '/api/cineca/': cinecaSidebar,
  '/api/miur/': miurSidebar,
  '/api/european-data-portal/': europeanDataPortalSidebar,
  '/api/int-private/': privateApiSidebar,
  '/api/': apiRootSidebar,
};

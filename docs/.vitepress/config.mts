import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'OhMyUniversity!',
  description:
    'Open source University Data Platform by OhMyOpenSource! - Docs, API Reference & Project Specifications',
  lang: 'en-US',

  srcDir: '.',
  outDir: '../dist',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/omos-logo.png' }],
    ['meta', { name: 'theme-color', content: '#3451b2' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'OhMyUniversity! Docs' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Open Source University Data Platform',
      },
    ],
  ],

  themeConfig: {
    logo: '/omos-logo.png',
    siteTitle: 'OhMyUniversity!',

    // ================================
    // TOP NAVIGATION
    // ================================
    nav: [
      {
        text: 'Project',
        activeMatch: '/project/',
        items: [
          {
            text: 'Formal Documents',
            items: [
              {
                text: '📋 RAD — Requirements & Analysis',
                link: '/project/rad/overview',
              },
              { text: '🏗️ SDD — System Design', link: '/project/sdd/overview' },
              {
                text: '⚙️ ODD — Operational Design',
                link: '/project/odd/overview',
              },
            ],
          },
          {
            text: 'Supporting Material',
            items: [
              { text: '📐 UML Diagrams', link: '/project/uml/index' },
              { text: '🧪 Test Plan', link: '/project/testing/test-plan' },
              {
                text: '📖 User Manual',
                link: '/project/user-manual/getting-started',
              },
            ],
          },
        ],
      },
      { text: 'Getting Started', link: '/getting-started/overview' },
      { text: 'Architecture', link: '/architecture/overview' },
      {
        text: 'API Reference',
        items: [
          { text: 'API Index', link: '/api/api-index' },
          { text: 'CINECA', link: '/api/cineca/overview' },
          { text: 'MIUR', link: '/api/miur/overview' },
          {
            text: 'European Data Portal',
            link: '/api/european-data-portal/overview',
          },
        ],
      },
      { text: 'Guides', link: '/guides/data-sources-overview' },
      {
        text: 'GitHub',
        link: 'https://github.com/ohmyopensource/ohmyuniversity-docs',
        target: '_blank',
      },
    ],

    // ================================
    // SIDEBARS
    // ================================
    sidebar: {
      // ================================
      // PROJECT INDEX
      // ================================
      '/project/': [
        {
          text: '📋 RAD — Requirements & Analysis',
          link: '/project/rad/overview',
        },
        {
          text: '🏗️ SDD — System Design',
          link: '/project/sdd/overview',
        },
        {
          text: '⚙️ ODD — Operational Design',
          link: '/project/odd/overview',
        },
        {
          text: '📐 UML Diagrams',
          link: '/project/uml/index',
        },
        {
          text: '🧪 Test Plan',
          link: '/project/testing/test-plan',
        },
        {
          text: '📖 User Manual',
          link: '/project/user-manual/getting-started',
        },
      ],
      // ================================
      // RAD
      // ================================
      '/project/rad/': [
        {
          text: '<= Project Docs',
          link: '/project/',
        },
        {
          text: '📋 RAD',
          items: [{ text: 'Overview', link: '/project/rad/overview' }],
        },
        {
          text: 'Stakeholders & Actors',
          collapsed: false,
          items: [
            { text: 'Stakeholders', link: '/project/rad/stakeholders' },
            { text: 'System Actors', link: '/project/rad/actors' },
            { text: 'User Personas', link: '/project/rad/user-personas' },
          ],
        },
        {
          text: 'Use Cases & Flows',
          collapsed: false,
          items: [
            { text: 'Use Cases', link: '/project/rad/use-cases' },
            { text: 'User Stories', link: '/project/rad/user-stories' },
            { text: 'User Flows', link: '/project/rad/user-flows' },
          ],
        },
        {
          text: 'Requirements',
          collapsed: false,
          items: [
            {
              text: 'Functional Requirements',
              link: '/project/rad/functional-requirements',
            },
            {
              text: 'Non-Functional Requirements',
              link: '/project/rad/non-functional-requirements',
            },
          ],
        },
        {
          text: 'UML Diagrams',
          collapsed: true,
          items: [
            {
              text: '↗ Use Case Diagram',
              link: '/project/uml/use-case-diagram',
            },
            {
              text: '↗ Activity Diagrams',
              link: '/project/uml/activity-diagrams',
            },
          ],
        },
      ],

      // ================================
      // SDD
      // ================================
      '/project/sdd/': [
        {
          text: '<= Project Docs',
          link: '/project/',
        },
        {
          text: '🏗️ SDD',
          items: [{ text: 'Overview', link: '/project/sdd/overview' }],
        },
        {
          text: 'Architecture & Stack',
          collapsed: false,
          items: [
            {
              text: 'System Architecture',
              link: '/project/sdd/system-architecture',
            },
            { text: 'Technology Stack', link: '/project/sdd/technology-stack' },
            {
              text: 'Deployment Architecture',
              link: '/project/sdd/deployment-architecture',
            },
          ],
        },
        {
          text: 'Design Specifications',
          collapsed: false,
          items: [
            { text: 'Data Model', link: '/project/sdd/data-model' },
            { text: 'API Design', link: '/project/sdd/api-design' },
            { text: 'Security Design', link: '/project/sdd/security-design' },
          ],
        },
        {
          text: 'Architecture Decision Records',
          collapsed: false,
          items: [
            { text: 'ADR Index', link: '/project/sdd/adr/index' },
            {
              text: 'ADR-001 — Database',
              link: '/project/sdd/adr/adr-001-database',
            },
            {
              text: 'ADR-002 — API Framework',
              link: '/project/sdd/adr/adr-002-api-framework',
            },
            { text: 'Template', link: '/project/sdd/adr/adr-NNN-template' },
          ],
        },
        {
          text: 'UML Diagrams',
          collapsed: true,
          items: [
            { text: '↗ Class Diagram', link: '/project/uml/class-diagram' },
            {
              text: '↗ Component Diagram',
              link: '/project/uml/component-diagram',
            },
            {
              text: '↗ Deployment Diagram',
              link: '/project/uml/deployment-diagram',
            },
            {
              text: '↗ Sequence Diagrams',
              link: '/project/uml/sequence-diagrams',
            },
          ],
        },
      ],

      // ================================
      // ODD
      // ================================
      '/project/odd/': [
        {
          text: '<= Project Docs',
          link: '/project/',
        },
        {
          text: '⚙️ ODD',
          items: [{ text: 'Overview', link: '/project/odd/overview' }],
        },
        {
          text: 'Data Operations',
          collapsed: false,
          items: [
            { text: 'Data Ingestion', link: '/project/odd/data-ingestion' },
            { text: 'Data Processing', link: '/project/odd/data-processing' },
            { text: 'Business Rules', link: '/project/odd/business-rules' },
          ],
        },
        {
          text: 'Operational Procedures',
          collapsed: false,
          items: [
            { text: 'Error Handling', link: '/project/odd/error-handling' },
            {
              text: 'Monitoring & Logging',
              link: '/project/odd/monitoring-logging',
            },
            {
              text: 'Maintenance Procedures',
              link: '/project/odd/maintenance-procedures',
            },
          ],
        },
      ],

      // ================================
      // UML
      // ================================
      '/project/uml/': [
        {
          text: '<= Project Docs',
          link: '/project/',
        },
        {
          text: '📐 UML Diagrams',
          items: [{ text: 'Index', link: '/project/uml/index' }],
        },
        {
          text: 'Structural Diagrams',
          collapsed: false,
          items: [
            { text: 'Class Diagram', link: '/project/uml/class-diagram' },
            {
              text: 'Component Diagram',
              link: '/project/uml/component-diagram',
            },
            {
              text: 'Deployment Diagram',
              link: '/project/uml/deployment-diagram',
            },
          ],
        },
        {
          text: 'Behavioral Diagrams',
          collapsed: false,
          items: [
            { text: 'Use Case Diagram', link: '/project/uml/use-case-diagram' },
            {
              text: 'Sequence Diagrams',
              link: '/project/uml/sequence-diagrams',
            },
            {
              text: 'Activity Diagrams',
              link: '/project/uml/activity-diagrams',
            },
          ],
        },
      ],

      // ================================
      // TESTING
      // ================================
      '/project/testing/': [
        {
          text: '<= Project Docs',
          link: '/project/',
        },
        {
          text: '🧪 Testing',
          items: [
            { text: 'Test Plan', link: '/project/testing/test-plan' },
            { text: 'Test Strategy', link: '/project/testing/test-strategy' },
          ],
        },
        {
          text: 'Test Specifications',
          collapsed: false,
          items: [
            { text: 'Unit Tests', link: '/project/testing/unit-tests' },
            {
              text: 'Integration Tests',
              link: '/project/testing/integration-tests',
            },
            { text: 'End-to-End Tests', link: '/project/testing/e2e-tests' },
            {
              text: 'Performance Tests',
              link: '/project/testing/performance-tests',
            },
          ],
        },
      ],

      // ================================
      // USER MANUAL
      // ================================
      '/project/user-manual/': [
        {
          text: '<= Project Docs',
          link: '/project/',
        },
        {
          text: '📖 User Manual',
          items: [
            {
              text: 'Getting Started',
              link: '/project/user-manual/getting-started',
            },
          ],
        },
        {
          text: 'Platform Guides',
          collapsed: false,
          items: [
            { text: 'Web Application', link: '/project/user-manual/web-app' },
            {
              text: 'Mobile Application',
              link: '/project/user-manual/mobile-app',
            },
          ],
        },
        {
          text: 'Support',
          collapsed: false,
          items: [
            { text: 'FAQ', link: '/project/user-manual/faq' },
            {
              text: 'Troubleshooting',
              link: '/project/user-manual/troubleshooting',
            },
          ],
        },
      ],

      // ================================
      // GETTING STARTED
      // ================================
      '/getting-started/': [
        {
          text: '🚀 Getting Started',
          items: [
            { text: 'Overview', link: '/getting-started/overview' },
            { text: 'Setup', link: '/getting-started/setup' },
            { text: 'API Quickstart', link: '/getting-started/api' },
            { text: 'Contributing', link: '/getting-started/contribute' },
          ],
        },
      ],

      // ================================
      // ARCHITECTURE
      // ================================
      '/architecture/': [
        {
          text: '🏛️ Architecture',
          items: [
            { text: 'Overview', link: '/architecture/overview' },
            { text: 'System Context', link: '/architecture/system-context' },
          ],
        },
        {
          text: 'API Backend',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/architecture/api/overview' },
            { text: 'API Design', link: '/architecture/api/api-design' },
            { text: 'Architecture', link: '/architecture/api/architecture' },
            { text: 'Authentication', link: '/architecture/api/auth' },
            { text: 'Database', link: '/architecture/api/database' },
          ],
        },
        {
          text: 'Web App',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/architecture/web/overview' },
            { text: 'Architecture', link: '/architecture/web/architecture' },
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
            { text: 'Overview', link: '/architecture/mobile/overview' },
            { text: 'Architecture', link: '/architecture/mobile/architecture' },
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
            { text: 'Overview', link: '/architecture/desktop/overview' },
            {
              text: 'Architecture',
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

      // ================================
      // API REFERENCE
      // ================================
      '/api/': [
        {
          text: '📡 API Reference',
          items: [
            { text: 'API Index', link: '/api/api-index' },
            { text: 'Conventions', link: '/api/conventions' },
          ],
        },
        {
          text: 'CINECA',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/api/cineca/overview' },
            { text: 'Authentication', link: '/api/cineca/auth' },
            { text: 'Endpoints', link: '/api/cineca/endpoints' },
            { text: 'Changelog', link: '/api/cineca/changelog' },
          ],
        },
        {
          text: 'MIUR',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/api/miur/overview' },
            { text: 'Authentication', link: '/api/miur/auth' },
            { text: 'Endpoints', link: '/api/miur/endpoints' },
            { text: 'Datasets', link: '/api/miur/datasets' },
            { text: 'Changelog', link: '/api/miur/changelog' },
          ],
        },
        {
          text: 'European Data Portal',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/api/european-data-portal/overview' },
            { text: 'Authentication', link: '/api/european-data-portal/auth' },
            { text: 'Endpoints', link: '/api/european-data-portal/endpoints' },
            { text: 'Changelog', link: '/api/european-data-portal/changelog' },
          ],
        },
      ],

      // ================================
      // GUIDES
      // ================================
      '/guides/': [
        {
          text: '📚 Guides',
          items: [
            {
              text: 'Data Sources Overview',
              link: '/guides/data-sources-overview',
            },
            { text: 'API Usage Patterns', link: '/guides/api-usage-patterns' },
          ],
        },
        {
          text: 'Data Sources',
          collapsed: false,
          items: [
            { text: 'CINECA Data Guide', link: '/guides/cineca-data-guide' },
            { text: 'MIUR Data Guide', link: '/guides/miur-data-guide' },
            {
              text: 'European Data Portal Guide',
              link: '/guides/european-data-portal-guide',
            },
          ],
        },
        {
          text: 'Data Engineering',
          collapsed: false,
          items: [
            { text: 'Common Data Issues', link: '/guides/common-data-issues' },
            {
              text: 'Data Cleaning Strategies',
              link: '/guides/data-cleaning-strategies',
            },
            {
              text: 'Dataset Normalization',
              link: '/guides/dataset-normalization',
            },
            {
              text: 'Mapping University Codes',
              link: '/guides/mapping-university-codes',
            },
            {
              text: 'Year Aggregation Rules',
              link: '/guides/year-aggregation-rules',
            },
          ],
        },
      ],
    },

    // ================================
    // SITE EXTRAS
    // ================================
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/ohmyopensource/ohmyuniversity-docs',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present OhMyOpenSource Contributors',
    },

    editLink: {
      pattern:
        'https://github.com/ohmyopensource/ohmyuniversity-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },

    outline: {
      label: 'On this page',
      level: [2, 3],
    },

    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
  },
});

---
title: Authentication | Moodle | OhMyUniversity!
description: Overview of the authentication model used in Moodle installations — plugin-based login, SSO options, token-based Web Services access, and user roles.
head:
  - - meta
    - property: og:title
      content: Authentication | Moodle | OhMyUniversity!
  - - meta
    - property: og:description
      content: Overview of the authentication model used in Moodle installations — plugin-based login, SSO options, token-based Web Services access, and user roles.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/moodle/auth
  - - meta
    - name: keywords
      content: moodle authentication, moodle sso, moodle oauth2, moodle saml2, moodle ldap, moodle token, moodle web services auth, ohmyuniversity moodle auth
  - - meta
    - name: twitter:title
      content: Authentication | Moodle | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Overview of the authentication model used in Moodle installations — plugin-based login, SSO options, token-based Web Services access, and user roles.
---

# OhMyUniversity! - Moodle: Authentication

This page describes the authentication model used across Moodle installations, both for interactive user login and for programmatic access via the Web Services API. Unlike Multiversity, Moodle is open source and its authentication layer is fully documented and publicly specified.

::: info
Each Italian university runs its own independent Moodle instance and configures authentication independently. The information on this page describes the standard Moodle authentication model — the specific combination of methods enabled varies by institution.
:::

---

## How authentication works in Moodle

Moodle supports a **plugin-based authentication system**. Multiple authentication plugins can be active simultaneously on the same instance, allowing different user populations to authenticate via different methods. Each user account is tied to a single authentication source, but the site can present login options for several providers side by side.

This is fundamentally different from the Multiversity model: there is no shared identity layer across institutions. Each Moodle instance manages its own users, credentials, and session state independently.

---

## Authentication Plugins

The most common authentication plugins found in Italian university deployments are:

**Manual accounts** — the default method; credentials are stored directly in the Moodle database. Usually combined with one of the federated methods below.

**LDAP / Active Directory** — delegates authentication to an institutional directory server. On successful login, Moodle can automatically provision or update the local user account using directory attributes. Common in institutions that already manage staff and student accounts via Active Directory or OpenLDAP.

**SAML2** — the standard choice for institutions participating in identity federations. Not included in Moodle core; typically provided by the `auth_saml2` plugin by Catalyst IT. Widely used for integration with **IDEM**, the Italian university identity federation operated by GARR, which allows students and staff to use their institutional credentials across all federated services.

**OAuth2** — natively supported since Moodle 3.3. Allows authentication via any standard OAuth2/OIDC-compliant identity provider — Google Workspace, Microsoft Entra ID, or a custom institutional IdP. On first login, Moodle creates a local account linked to the external identity.

**CAS (Central Authentication Service)** — natively supported; redirects users to a central CAS server for authentication and returns a service ticket to Moodle for validation. Common in older institutional deployments.

---

## Web Services Authentication: Tokens

Authentication for the Moodle Web Services API is **token-based** and entirely separate from the interactive login flow. A token is a long-lived credential that identifies a user and the external service they are authorised to access.

Tokens can be generated manually by an administrator or obtained programmatically via the `/login/token.php` endpoint by supplying a username, password, and service shortname. Once obtained, the token is passed as a `wstoken` parameter in every API request — no session, no cookie, no OAuth flow is involved.

Access is further scoped by **external services**: each Moodle instance defines one or more named services that group a set of allowed API functions. A token is always bound to a specific service, and can only call the functions that service exposes.

---

## User Roles

Access to platform features is controlled by a **role and capability system**. Roles are assigned to users within a specific **context** (system, category, course, or activity), and each role is a collection of fine-grained capabilities. The standard roles shipped with Moodle are:

- **Site Administrator** — full unrestricted access; manages the entire instance
- **Manager** — broad administrative powers across courses and categories
- **Course Creator** — can create new courses
- **Teacher (Editing)** — can manage course content and grade students
- **Teacher (Non-editing)** — can grade and interact but cannot modify course structure
- **Student** — can access course content and submit work
- **Guest** — read-only access; cannot submit or interact

Roles are context-sensitive: a user can hold a Teacher role in one course and a Student role in another simultaneously. For Web Services integrations, a common pattern is to create a **dedicated service account** with a custom role granting only the capabilities required by the integration.

---

## What this means for integrators

Moodle does expose a publicly documented Web Services API, but because each university manages its own instance, direct integration requires coordination with each institution individually:

- There is no central token endpoint — each instance has its own `/login/token.php` at its own domain
- The external service shortname required for token generation is set by each institution's administrator and must be known in advance
- Web services may be disabled entirely on instances that have not been configured for external access

For institution-specific details — base URL, service shortname, and available functions — refer to the relevant subsection in this documentation where available.

---

## References

- **Moodle Web Services documentation:** [moodledev.io/docs/apis/subsystems/external](https://moodledev.io/docs/apis/subsystems/external)
- **Using Web Services (admin guide):** [docs.moodle.org/en/Using_web_services](https://docs.moodle.org/en/Using_web_services)
- **OAuth2 authentication:** [docs.moodle.org/en/OAuth_2_authentication](https://docs.moodle.org/en/OAuth_2_authentication)
- **Authentication plugins:** [docs.moodle.org/dev/Authentication_plugins](https://docs.moodle.org/dev/Authentication_plugins)
- **SAML2 plugin (Catalyst):** [moodle.org/plugins/auth_saml2](https://moodle.org/plugins/auth_saml2)
- **IDEM federation (GARR):** [idem.garr.it](https://idem.garr.it)

---
title: Authentication | Moodle | OhMyUniversity!
description: Overview of the authentication model used in Moodle - native login, SSO options (OAuth2, SAML2, LDAP, CAS), token-based Web Services access, and what this means for integrators.
head:
  - - meta
    - property: og:title
      content: Authentication | Moodle | OhMyUniversity!
  - - meta
    - property: og:description
      content: Overview of the authentication model used in Moodle - native login, SSO options (OAuth2, SAML2, LDAP, CAS), token-based Web Services access, and what this means for integrators.
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
      content: Overview of the authentication model used in Moodle - native login, SSO options (OAuth2, SAML2, LDAP, CAS), token-based Web Services access, and what this means for integrators.
---

# OhMyUniversity! - Moodle: Authentication

This page describes the authentication model used across Moodle installations, both for interactive user login and for programmatic access via the Web Services API. Unlike Multiversity, Moodle is open source and its authentication layer is fully documented.

::: info
Each Italian university runs its own independent Moodle instance and may configure authentication differently. The information on this page describes the standard Moodle authentication infrastructure - always verify against the specific institution's configuration.
:::

---

## How authentication works in Moodle

Moodle supports a **plugin-based authentication system**. Multiple authentication plugins can be enabled simultaneously on the same site, allowing different user populations to authenticate via different methods. Each user account is associated with a single active authentication source, but the site can offer login buttons for several providers side by side.

For the Web Services API, authentication is handled separately via **token-based access**, entirely independent of the interactive login flow.

---

## Interactive Login: Authentication Plugins

Moodle ships with a set of built-in authentication plugins and supports third-party plugins from the Moodle plugin directory. The most relevant for Italian university deployments are:

### Manual accounts (native login)

The default method. Users authenticate with a username and password stored in the Moodle database. Institutions typically use this in combination with one of the SSO methods below for federated access.

### LDAP / Active Directory

Moodle can delegate authentication to an LDAP server such as Microsoft Active Directory or OpenLDAP. On successful authentication, Moodle can automatically create or update the local user account using attributes from the directory (name, email, group memberships). This method is common in institutions that already manage user accounts centrally via a directory service.

When combined with a network-level SSO solution, LDAP authentication can allow users to access Moodle without re-entering credentials if they are already logged into the institutional network.

### OAuth2

Natively supported in Moodle core since version 3.3. OAuth2 allows users to authenticate via an external identity provider - such as Google Workspace, Microsoft Entra ID (formerly Azure AD), or any other standard OAuth2/OIDC-compliant provider. On first login, Moodle creates a local account linked to the external identity.

Configuration requires:

- An OAuth2 issuer registered under `Site Administration > Server > OAuth 2 Services`
- A client ID and secret from the identity provider
- A redirect URI registered with the provider pointing to `{wwwroot}/admin/oauth2callback.php`

### SAML2

Not included in Moodle core; requires a third-party plugin (the most widely used is `auth_saml2` by Catalyst IT). SAML2 is the standard choice for institutions participating in national or international identity federations such as IDEM (the Italian university federation operated by GARR). The plugin embeds a SimpleSAMLphp instance internally, requiring no separate application installation.

### CAS (Central Authentication Service)

Supported natively. CAS is a protocol for web-based SSO, commonly used in older institutional deployments. It redirects users to a central CAS server for authentication and returns a service ticket to Moodle for validation.

### OpenID Connect

Available via the Microsoft 365 plugin suite (`auth_oidc`). Provides SSO via any OpenID Connect-compliant identity provider. Widely used for Microsoft Entra ID and Azure B2C integrations in corporate and academic environments.

---

## Web Services Authentication: Tokens

Authentication for the Moodle Web Services API is **token-based** and completely separate from the interactive login flow.

### Token types

| Type                   | How it is obtained                                                                                                                                       | Notes                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **User token**         | Generated by the user via their profile page (`Security keys`), or by an administrator via `Site Administration > Server > Web Services > Manage tokens` | Scoped to a specific external service; may have an IP restriction and expiry date |
| **Programmatic token** | Obtained via the `auth/token.php` endpoint                                                                                                               | Requires username, password, and service shortname; returns a token for API use   |

### Obtaining a token programmatically

```
POST /login/token.php
Content-Type: application/x-www-form-urlencoded

username={USERNAME}
&password={PASSWORD}
&service={SERVICE_SHORTNAME}
```

A successful response returns:

```json
{ "token": "abc123...", "privatetoken": null }
```

This token is then passed as `wstoken` in all subsequent API requests.

::: warning
Programmatic token generation requires the user to have the `moodle/webservice:createtoken` capability, and the requested external service must exist and be enabled on the instance. The `service` parameter must match the **shortname** of a configured external service, not its display name.
:::

### Token usage in API requests

Once obtained, the token is passed as a query parameter in every API call:

```
GET /webservice/rest/server.php
  ?wstoken={TOKEN}
  &wsfunction={FUNCTION_NAME}
  &moodlewsrestformat=json
```

Tokens do not expire by default, but administrators can set an expiry date and optionally restrict usage to specific IP addresses.

---

## Capability requirements

Not all Web Services functions are available to all users. Access is controlled by the **role and capability system**:

- The user account associated with a token must have the **capabilities required by each function** it calls
- Required capabilities are listed in the API documentation page of each Moodle instance (`Site Administration > Server > Web Services > API Documentation`)
- A common pattern for integrations is to create a dedicated service account with a custom role granting only the necessary capabilities

---

## What this means for integrators

Unlike Multiversity, Moodle does expose a public and officially documented Web Services API. However, because each university manages its own instance, there are practical considerations:

- **No central token endpoint**: each institution has its own `/login/token.php` at its own domain
- **No standardised service shortname**: the shortname of the external service to request a token for is set by each institution's administrator; it must be known in advance
- **Instance-specific API surface**: the set of available functions depends on which plugins are installed and which functions have been added to the configured service
- **Web services may be disabled**: universities that have not configured web services will return an error on token requests; check whether the institution has enabled this feature

For institutions listed in OhMyUniversity!, the relevant service shortname, base URL, and available functions are documented in the institution-specific subsection where known.

---

## References

- **Moodle Web Services documentation:** [moodledev.io/docs/apis/subsystems/external](https://moodledev.io/docs/apis/subsystems/external)
- **Using Web Services (admin guide):** [docs.moodle.org/en/Using_web_services](https://docs.moodle.org/en/Using_web_services)
- **OAuth2 authentication:** [docs.moodle.org/en/OAuth_2_authentication](https://docs.moodle.org/en/OAuth_2_authentication)
- **OAuth2 services configuration:** [docs.moodle.org/en/OAuth_2_services](https://docs.moodle.org/en/OAuth_2_services)
- **Authentication plugins:** [docs.moodle.org/dev/Authentication_plugins](https://docs.moodle.org/dev/Authentication_plugins)
- **SAML2 plugin (Catalyst):** [moodle.org/plugins/auth_saml2](https://moodle.org/plugins/auth_saml2)
- **OpenID Connect plugin:** [moodle.org/plugins/auth_oidc](https://moodle.org/plugins/auth_oidc)
- **IDEM federation (GARR):** [idem.garr.it](https://idem.garr.it)

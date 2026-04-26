---
title: MUR USTAT API - Auth | OhMyUniversity!
description: Authentication for the MUR USTAT portal APIs. All public read endpoints require no credentials.
head:
  - - meta
    - property: og:title
      content: MUR USTAT API - Auth | OhMyUniversity!
  - - meta
    - property: og:description
      content: Authentication for the MUR USTAT portal APIs. All public read endpoints require no credentials.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/mur/auth
  - - meta
    - name: keywords
      content: mur api auth, ckan api key, autenticazione mur ustat, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: MUR USTAT API - Auth | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Authentication for the MUR USTAT portal APIs. All public read endpoints require no credentials.
---

# OhMyUniversity! - MUR USTAT: Auth

**Version:** `3.0` · **Standard:** `CKAN API v3`

---

## Public access

All APIs documented in this section are **freely accessible**. No registration, API key or token is required to:

- Browse and retrieve the list and detail of datasets
- Download resource metadata
- Run queries on the Datastore
- Access tags, groups, organizations and portal status

Simply send `GET` requests to `https://dati-ustat.mur.gov.it/api/3/action/{action_name}` with no additional headers.

---

## API Key (restricted operations)

The CKAN standard supports authentication via **API Key** for write operations (creating or editing datasets, uploading resources) or for accessing private datasets. These operations are not exposed on the public MUR USTAT instance, but the mechanism is as follows if ever needed:

### Header

```http
Authorization: <api-key>
```

Or, in older CKAN versions:

```http
X-CKAN-API-Key: <api-key>
```

### Query string (alternative)

```
GET /api/3/action/{action_name}?apikey=<api-key>
```

::: tip
Passing the API key as a query string is discouraged for security reasons (the key is visible in server logs). Always prefer the `Authorization` header.
:::

---

## Endpoints with known restrictions

Some endpoints on the MUR USTAT instance return errors regardless of authentication, likely due to portal configuration:

| Endpoint            | Status      | Notes                                           |
| ------------------- | ----------- | ----------------------------------------------- |
| `datastore_info`    | Not working | Returns an internal error on any valid resource |
| `group_show`        | Not working | Returns a validation error with any `id`        |
| `organization_list` | Not working | Endpoint not enabled                            |
| `organization_show` | Not working | Endpoint not enabled                            |

These endpoints are documented in their respective sections but marked.

---

## References

- **CKAN authentication documentation:** [docs.ckan.org - API authentication](https://docs.ckan.org/en/latest/api/index.html#authentication-and-api-keys)
- **MUR USTAT portal:** [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it)

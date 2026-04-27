---
title: European Data Portal API - Auth | OhMyUniversity!
description: Authentication for the European Data Portal APIs. All public read endpoints require no credentials.
head:
  - - meta
    - property: og:title
      content: European Data Portal API - Auth | OhMyUniversity!
  - - meta
    - property: og:description
      content: Authentication for the European Data Portal APIs. All public read endpoints require no credentials.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/edp/auth
  - - meta
    - name: keywords
      content: european data portal auth, edp api authentication, data.europa.eu openid connect, oauth2 open data europe, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: European Data Portal API - Auth | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Authentication for the European Data Portal APIs. All public read endpoints require no credentials.
---

# OhMyUniversity! - European Data Portal API: Auth

**Portal:** `data.europa.eu` · **Standard:** `DCAT-AP / RDF`

---

## Public access

All EDP APIs used by OhMyUniversity! are **freely accessible without any credentials**. No registration, API key, token or OAuth flow is required to:

- Search and filter datasets via the Search API
- Retrieve DCAT-AP metadata records via the Registry API
- Execute read-only SPARQL queries on the triple store
- Access metadata quality scores via the MQA API

Simply issue `GET` requests to the relevant base URL with no additional headers:

```http
GET https://data.europa.eu/api/hub/search/search?q=university
```

```http
GET https://data.europa.eu/api/hub/repo/datasets?limit=50&valueType=identifiers
```

```http
GET https://data.europa.eu/sparql?query=SELECT+...&format=application%2Fsparql-results%2Bjson
```

---

## OAuth2 / OpenID Connect (write operations)

The Registry API supports **write operations** (creating, updating and deleting dataset records) for registered data providers. These operations are protected via **OpenID Connect**, the authentication layer built on top of OAuth2.

This flow is entirely **out of scope for OhMyUniversity!**, which only consumes data and never writes to the portal. It is documented here for completeness.

### Flow overview

1. Obtain a Bearer token from the EDP identity provider via OpenID Connect.
2. Include the token in the `Authorization` header of write requests.

### Header

```http
Authorization: Bearer <your-access-token>
```

### Example (dataset deletion)

```http
DELETE https://data.europa.eu/api/hub/repo/catalogues/{catalogue-id}/datasets/origin?originalId={dataset-id}
Authorization: Bearer <your-access-token>
```

A successful response returns `204 No Content`.

::: tip
Write access requires a registered account with the EDP team and explicit write permissions on at least one catalogue. Contact the EDP team at [data.europa.eu](https://data.europa.eu) for further information.
:::

---

## SPARQL endpoint - anonymous restrictions

The SPARQL endpoint at `https://data.europa.eu/sparql` is publicly accessible, but with one restriction:

| Operation                      | Anonymous   | Authenticated               |
| ------------------------------ | ----------- | --------------------------- |
| `SELECT` queries               | Allowed     | Allowed                     |
| `CONSTRUCT` / `DESCRIBE`       | Allowed     | Allowed                     |
| `ASK`                          | Allowed     | Allowed                     |
| `INSERT` / `UPDATE` / `DELETE` | Not allowed | Allowed (write credentials) |

For OhMyUniversity!, only read queries (`SELECT`, `CONSTRUCT`, `DESCRIBE`, `ASK`) are used, so no authentication is ever needed on the SPARQL endpoint.

---

## Known access constraints

| API                  | Constraint                           | Notes                                      |
| -------------------- | ------------------------------------ | ------------------------------------------ |
| Search API           | Read-only for public                 | No write operations available via this API |
| Registry API (read)  | No auth required                     | Full metadata retrieval is public          |
| Registry API (write) | Requires OpenID Connect Bearer token | Out of scope for OhMyUniversity!           |
| SPARQL API           | Read-only for anonymous              | Write/update queries require credentials   |
| MQA API              | No auth required                     | Fully public, read-only                    |

---

## References

- **EDP API documentation:** [dataeuropa.gitlab.io/data-provider-manual/api-documentation](https://dataeuropa.gitlab.io/data-provider-manual/api-documentation/)
- **OpenID Connect specification:** [openid.net/connect](https://openid.net/connect/)
- **EDP data provider manual:** [dataeuropa.gitlab.io/data-provider-manual](https://dataeuropa.gitlab.io/data-provider-manual/)

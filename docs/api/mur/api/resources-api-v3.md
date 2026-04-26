---
title: Resources API V3 | OhMyUniversity!
description: REST API documentation for the Resource endpoints of the MUR USTAT CKAN portal - metadata detail and resource search.
head:
  - - meta
    - property: og:title
      content: Resources API V3 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Resource endpoints of the MUR USTAT CKAN portal - metadata detail and resource search.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/mur/api/resources-api-v3
  - - meta
    - name: keywords
      content: mur api risorse, ckan resource show, resource search, ustat api, dati università mur, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: Resources API V3 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Resource endpoints of the MUR USTAT CKAN portal - metadata detail and resource search.
---

# OhMyUniversity! - MUR USTAT: Resources API V3

**Version:** `3.0` · **Standard:** `CKAN API v3` · **Base URL:** `https://dati-ustat.mur.gov.it/api/3/action`

Endpoints for accessing the metadata of CKAN **resources**. A resource represents a single file or table inside a dataset: it can be a CSV uploaded to the portal, an XLSX, a PDF, or a link to an external API. Resources that contain structured data may be queried directly through the [Datastore](./datastore-api-v3).

---

## Available endpoints

| Action                                    | Description                             | Status    |
| ----------------------------------------- | --------------------------------------- | --------- |
| [`resource_show`](#get-resource_show)     | Full metadata of a single resource      | Available |
| [`resource_search`](#get-resource_search) | Search resources by name, format or URL | Available |

---

## Resource - Datastore relationship

A resource with `datastore_active: true` has its data loaded into the CKAN **Datastore** (PostgreSQL) and can be queried via [`datastore_search`](./datastore-api-v3#get-datastore_search) or [`datastore_search_sql`](./datastore-api-v3#get-datastore_search_sql) using its `id` as `resource_id`.

```
Dataset
└── Resource (id: "abc-123", datastore_active: true)
        └── Datastore > queryable via datastore_search?resource_id=abc-123
```

---

### `GET /resource_show` - Get resource detail

```java
/**
 * Returns the full metadata of a single resource: name, format, direct
 * download URL, file size, datastore status, creation and modification dates.
 *
 * @param id               string (query, required)  - resource UUID
 *                                                     (e.g. "8a9dc700-a84d-4536-b211-3f7e79e5ab0a")
 * @param include_tracking boolean (query, optional) - if true, includes download
 *                                                     tracking statistics
 * @return Resource resource metadata object on success,
 *         CKANError on failure
 */
GET /resource_show
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": {
    "id": "f82077e0-cf25-4ae4-b76d-a2e369be4849", // resource UUID (use as resource_id in datastore)
    "package_id": "94364467-8ac0-436c-bb36-a5f037a45d5a", // parent dataset UUID
    "name": "1997-2001 Tracciato record personale università", // resource display name
    "description": "Tracciato record dei file csv...", // resource description (may be null)
    "format": "XLSX", // file format (CSV, XLSX, PDF, …)
    "distribution_format": "XLS", // distribution format (may differ from format)
    "mimetype": null, // MIME type (may be null)
    "mimetype_inner": null, // inner MIME type for archives (may be null)
    "size": null, // file size in bytes (may be null)
    "hash": "", // file hash (may be empty)
    "url": "https://dati-ustat.mur.gov.it/dataset/.../download/...", // direct download URL
    "url_type": "upload", // upload | link
    "state": "active", // resource state: active | deleted
    "datastore_active": false, // true if queryable via datastore_search
    "cache_url": null, // cached copy URL (may be null)
    "cache_last_updated": null, // cache last updated timestamp (may be null)
    "created": "2018-07-02T12:01:32.336477", // ISO 8601 creation date
    "last_modified": "2018-07-02T10:01:32.281613", // ISO 8601 last modified date
    "position": 0, // display order within the dataset
    "resource_type": null // resource type (may be null)
  },
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=resource_show"
}
```

**`404 Not Found`** - Resource not found.

```json
{
  "success": false,
  "error": {
    "__type": "Not Found Error",
    "message": "Not found"
  }
}
```

<br>

---

<br>

### `GET /resource_search` - Search resources

```java
/**
 * Searches resources using one or more field-specific filters. Supports
 * pagination and sorting. The query parameter accepts one or more
 * "field:value" pairs; multiple pairs are combined with AND logic.
 * Commonly used to find all resources of a given format (e.g. format:CSV)
 * or to look up resources by name prefix.
 *
 * @param query    string (query, required)  - filter expression in
 *                                             "field:value" format; supported
 *                                             fields include: name, description,
 *                                             format, url, datastore_active
 * @param fields   string (query, optional) - comma-separated list of fields
 *                                            to include in each result object;
 *                                            defaults to all fields
 * @param order_by string (query, optional) - sort expression; e.g. "name asc"
 *                                            or "last_modified desc"
 * @param limit    integer (query, optional) - maximum number of results;
 *                                            defaults to 10
 * @param offset   integer (query, optional) - pagination offset; defaults to 0
 * @return ResourceSearchResult object containing count and results on success,
 *         CKANError on failure
 */
GET /resource_search
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": {
    "count": 17, // total number of matching resources
    "results": [
      {
        "id": "8a9dc700-a84d-4536-b211-3f7e79e5ab0a", // resource UUID
        "package_id": "14aeb712-4665-4311-9e90-3e13639e8f50", // parent dataset UUID
        "name": "Informazioni sui file relativi agli Immatricolati", // display name
        "description": "Specifiche del contenuto dei file...", // description (may be null)
        "format": "XLSX", // file format
        "url": "https://dati-ustat.mur.gov.it/dataset/.../download/...", // download URL
        "state": "active", // resource state: active | deleted
        "datastore_active": false, // true if queryable via datastore_search
        "created": "2019-05-21T08:43:14.707396", // ISO 8601 creation date
        "last_modified": "2026-01-08T11:26:09.287623" // ISO 8601 last modified date
      }
    ]
  },
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=resource_search"
}
```

**`400 Bad Request`** - Missing or malformed `query` parameter.

```json
{
  "success": false,
  "error": {
    "__type": "Validation Error",
    "message": "Missing value"
  }
}
```

---

## References

- **Inline help:** `GET /api/3/action/help_show?name=resource_show`
- **CKAN Resource API documentation:** [docs.ckan.org - Dataset and resource API](https://docs.ckan.org/en/latest/api/index.html)
- **MUR USTAT portal:** [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it)

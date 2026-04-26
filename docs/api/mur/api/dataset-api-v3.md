---
title: Dataset API V3 | OhMyUniversity!
description: REST API documentation for the Dataset (package) endpoints of the MUR USTAT CKAN portal - list, search, detail and autocomplete.
head:
  - - meta
    - property: og:title
      content: Dataset API V3 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Dataset (package) endpoints of the MUR USTAT CKAN portal - list, search, detail and autocomplete.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/mur/api/dataset-api-v3
  - - meta
    - name: keywords
      content: mur api dataset, ckan package list, package show, package search, ustat api, dati università mur, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: Dataset API V3 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Dataset (package) endpoints of the MUR USTAT CKAN portal - list, search, detail and autocomplete.
---

# OhMyUniversity! - MUR USTAT: Dataset API V3

**Version:** `3.0` · **Standard:** `CKAN API v3` · **Base URL:** `https://dati-ustat.mur.gov.it/api/3/action`

Endpoints for browsing and searching **datasets** (also called _packages_ in CKAN terminology). Each dataset groups one or more resources (files or tables) related to a specific statistical topic.

---

## Available endpoints

| Action                                                                            | Description                                  | Status    |
| --------------------------------------------------------------------------------- | -------------------------------------------- | --------- |
| [`package_list`](#get-package_list)                                               | List all datasets (slugs/IDs)                | Available |
| [`package_show`](#get-package_show)                                               | Full metadata of a single dataset            | Available |
| [`package_search`](#get-package_search)                                           | Fulltext and filtered search on datasets     | Available |
| [`current_package_list_with_resources`](#get-current_package_list_with_resources) | Dataset list with resources already included | Available |
| [`package_autocomplete`](#get-package_autocomplete)                               | Autocomplete on dataset names                | Available |

---

### `GET /package_list` - List all datasets

```java
/**
 * Returns the complete list of IDs (slugs) of all public datasets on the
 * portal. Use package_show to retrieve the full metadata of each entry.
 *
 * @param limit  integer (query, optional) - maximum number of results to
 *                                           return; defaults to 100
 * @param offset integer (query, optional) - pagination offset; defaults to 0
 * @return List<string> list of dataset slugs on success,
 *         CKANError on failure
 */
GET /package_list
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true, // always true on success
  "result": [
    "1997-2001-personale-universitario", // dataset slug (use as id in package_show)
    "1999-2011-laureati",
    "2002-2008-personale-universitario",
    "2006-2015-contribuzione-e-interventi-afam",
    "2009-2013-contribuzione-e-interventi-atenei"
  ],
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=package_list" // inline help URL
}
```

**`400 Bad Request`** - Invalid parameters.

```json
{
  "success": false, // always false on error
  "error": {
    "__type": "Validation Error", // error category
    "message": "Parameter not found" // error description
  }
}
```

<br>

---

<br>

### `GET /package_show` - Get dataset detail

```java
/**
 * Returns the full metadata of a single dataset: title, description,
 * license, organization, tags, groups and the list of associated resources.
 *
 * @param id                 string (query, required)  - dataset slug or UUID
 *                                                       (e.g. "immatricolati")
 * @param use_default_schema boolean (query, optional) - if true, uses the CKAN
 *                                                       default schema instead of
 *                                                       the custom portal schema;
 *                                                       defaults to false
 * @return Package dataset metadata object on success,
 *         CKANError on failure
 */
GET /package_show
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": {
    "id": "14aeb712-4665-4311-9e90-3e13639e8f50", // dataset UUID
    "name": "immatricolati", // URL slug (use this in API calls)
    "title": "Immatricolati", // human-readable title
    "notes": "...", // full description (may be null)
    "license_id": "IODL-2.0", // license identifier
    "license_title": "Italian Open Data License v2.0", // license display name
    "maintainer": "MUR - Servizio Statistico", // maintainer name
    "maintainer_email": "ufficio.statistico@mur.gov.it",
    "author": "MUR - Servizio Statistico", // author name
    "author_email": "ufficio.statistico@mur.gov.it",
    "frequency": "ANNUAL", // update frequency
    "publisher_identifier": "m_pi", // publisher code (IPA)
    "publisher_name": "miur", // publisher slug
    "state": "active", // dataset state: active | deleted
    "private": false, // true if dataset is private
    "num_tags": 3, // number of tags
    "metadata_created": "2019-05-20T15:46:42.850444", // ISO 8601 creation date
    "metadata_modified": "2026-01-08T11:27:59.910613", // ISO 8601 last modified date
    "theme": "[{\"subthemes\": [\"http://eurovoc.europa.eu/100217\"], \"theme\": \"EDUC\"}]", // JSON-encoded EuroVoc theme
    "tags": [], // list of free tags (may be empty)
    "groups": [], // list of CKAN groups (empty on MUR USTAT)
    "organization": {}, // publishing organization object
    "resources": [
      {
        "id": "8a9dc700-a84d-4536-b211-3f7e79e5ab0a", // resource UUID (use as resource_id in datastore)
        "package_id": "14aeb712-4665-4311-9e90-3e13639e8f50", // parent dataset UUID
        "name": "Tracciato record", // resource display name
        "description": "...", // resource description (may be null)
        "format": "XLSX", // file format
        "distribution_format": "XLSX", // distribution format
        "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "url": "https://...", // direct download URL
        "url_type": "upload", // upload | link
        "state": "active", // resource state: active | deleted
        "datastore_active": false, // true if queryable via datastore_search
        "size": null, // file size in bytes (may be null)
        "created": "2019-05-20T15:46:42.850444", // ISO 8601 creation date
        "last_modified": "2026-01-08T11:26:09.287623", // ISO 8601 last modified date
        "position": 0 // display order within the dataset
      }
    ]
  },
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=package_show"
}
```

**`404 Not Found`** - Dataset not found.

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

### `GET /package_search` - Search datasets

```java
/**
 * Searches datasets using a Solr query. Returns a paginated result set with
 * total count and optional facets. The q parameter accepts full Solr syntax.
 * Multiple filters can be combined using fq.
 *
 * @param q              string (query, optional)  - fulltext Solr query;
 *                                                   defaults to "*:*" (all);
 *                                                   supports field syntax e.g.
 *                                                   title:immatricolati
 * @param fq             string (query, optional)  - Solr filter query applied
 *                                                   after scoring; e.g.
 *                                                   organization:mur
 * @param rows           integer (query, optional) - number of results per page;
 *                                                   defaults to 10
 * @param start          integer (query, optional) - pagination offset;
 *                                                   defaults to 0
 * @param sort           string (query, optional)  - sort field and direction;
 *                                                   e.g. "metadata_modified desc"
 * @param include_drafts boolean (query, optional) - include draft datasets;
 *                                                   requires authentication
 * @return PackageSearchResult object containing count, results and facets on
 *         success, CKANError on failure
 */
GET /package_search
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": {
    "count": 68, // total number of matching datasets
    "sort": "score desc, metadata_modified desc", // applied sort order
    "facets": {}, // legacy facets object (use search_facets)
    "search_facets": {}, // facet counts by field (empty if not requested)
    "results": [
      {
        "id": "b47de019-4086-4b19-bb6b-4d8bc622b195", // dataset UUID
        "name": "serie-storica-sul-personale-universitario", // URL slug
        "title": "Serie storica sul personale universitario", // display title
        "license_id": "IODL-2.0", // license identifier
        "state": "active", // dataset state: active | deleted
        "private": false, // visibility flag
        "maintainer": "MUR - Servizio Statistico",
        "maintainer_email": "ufficio.statistico@mur.gov.it",
        "metadata_modified": "2026-03-23T14:48:43.192183", // ISO 8601 last modified
        "num_tags": 13, // number of tags
        "resources": [] // resource list (may be empty in search results)
      }
    ]
  },
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=package_search"
}
```

**`400 Bad Request`** - Invalid Solr query syntax.

```json
{
  "success": false,
  "error": {
    "__type": "Search Query Error",
    "message": "..."
  }
}
```

<br>

---

<br>

### `GET /current_package_list_with_resources` - List datasets with resources

```java
/**
 * Returns a paginated list of datasets with their resources already embedded.
 * Equivalent to calling package_list followed by package_show for each entry,
 * but in a single request. Response payload can be very large - always use
 * an explicit limit.
 *
 * @param limit  integer (query, optional) - maximum number of datasets to
 *                                           return; defaults to 10
 * @param offset integer (query, optional) - pagination offset; defaults to 0
 * @return List<Package> list of dataset objects with embedded resources on
 *         success, CKANError on failure
 */
GET /current_package_list_with_resources
```

**Auth:** None · **Cache:** None

::: warning
This call can return several MB of data if results are not limited. Always pass an explicit `limit`.
:::

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": [
    {
      "id": "b47de019-4086-4b19-bb6b-4d8bc622b195", // dataset UUID
      "name": "serie-storica-sul-personale-universitario", // URL slug
      "title": "Serie storica sul personale universitario", // display title
      "license_id": "IODL-2.0", // license identifier
      "state": "active", // dataset state: active | deleted
      "maintainer": "MUR - Servizio Statistico",
      "maintainer_email": "ufficio.statistico@mur.gov.it",
      "metadata_modified": "2026-03-23T14:48:43.192183", // ISO 8601 last modified
      "resources": [
        {
          "id": "012f9a43-6493-49bb-88a1-a378994104a0", // resource UUID
          "format": "PDF", // file format
          "distribution_format": "PDF",
          "state": "active", // resource state: active | deleted
          "datastore_active": false // true if queryable via datastore_search
        }
      ]
    }
  ],
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=current_package_list_with_resources"
}
```

<br>

---

<br>

### `GET /package_autocomplete` - Autocomplete dataset names

```java
/**
 * Returns datasets whose name or title starts with the provided prefix
 * string. Intended for typeahead / live search UI implementations.
 *
 * @param q     string (query, required)  - search prefix string (matched
 *                                          against dataset name and title)
 * @param limit integer (query, optional) - maximum number of results;
 *                                          defaults to 10
 * @return List<PackageAutocompleteResult> list of matched datasets on
 *         success, CKANError on failure
 */
GET /package_autocomplete
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": [
    {
      "name": "immatricolati", // dataset slug
      "title": "Immatricolati (nuovi ingressi) e Iscritti al 1° anno", // display title
      "match_field": "name", // which field was matched: name | title
      "match_displayed": "immatricolati" // the matched string as displayed
    }
  ],
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=package_autocomplete"
}
```

**`400 Bad Request`** - Missing required parameter `q`.

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

- **Inline help:** `GET /api/3/action/help_show?name=package_list` (or any other action)
- **CKAN Dataset API documentation:** [docs.ckan.org - Dataset and resource API](https://docs.ckan.org/en/latest/api/index.html)
- **MUR USTAT portal:** [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it)

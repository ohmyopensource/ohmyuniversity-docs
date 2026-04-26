---
title: Portal API V3 | OhMyUniversity!
description: REST API documentation for the Portal endpoints of the MUR USTAT CKAN portal - status, licenses, vocabularies and inline help.
head:
  - - meta
    - property: og:title
      content: Portal API V3 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Portal endpoints of the MUR USTAT CKAN portal - status, licenses, vocabularies and inline help.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/mur/api/portal-api-v3
  - - meta
    - name: keywords
      content: mur api portale, ckan status show, license list, vocabulary list, help show, ustat api, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: Portal API V3 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Portal endpoints of the MUR USTAT CKAN portal - status, licenses, vocabularies and inline help.
---

# OhMyUniversity! - MUR USTAT: Portal API V3

**Version:** `3.0` · **Standard:** `CKAN API v3` · **Base URL:** `https://dati-ustat.mur.gov.it/api/3/action`

Utility endpoints for retrieving information about the portal itself: CKAN version, configured licenses, controlled vocabularies and inline action documentation.

---

## Available endpoints

| Action                                    | Description                         | Status    |
| ----------------------------------------- | ----------------------------------- | --------- |
| [`status_show`](#get-status_show)         | CKAN version and portal status      | Available |
| [`license_list`](#get-license_list)       | List of available licenses          | Available |
| [`vocabulary_list`](#get-vocabulary_list) | List of controlled vocabularies     | Available |
| [`help_show`](#get-help_show)             | Inline documentation for any action | Available |

---

### `GET /status_show` - Get portal status

```java
/**
 * Returns general information about the CKAN portal: version, URL, title,
 * default locale and list of active extensions.
 *
 * @param none
 * @return SiteStatus portal status object on success,
 *         CKANError on failure
 */
GET /status_show
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": {
    "ckan_version": "2.8.7", // CKAN version string
    "site_url": "https://dati-ustat.mur.gov.it", // portal base URL
    "site_title": "Open Data dell'istruzione superiore", // portal title (Italian, as configured)
    "site_description": "Open Data dell'istruzione superiore", // portal description
    "locale_default": "it", // default locale code
    "error_emails_to": null, // error notification email (may be null)
    "extensions": [
      "stats", // usage statistics
      "text_view", // plain text viewer
      "image_view", // image viewer
      "recline_view", // tabular data viewer
      "datastore", // queryable PostgreSQL layer
      "datapusher", // automatic CSV/XLS import into datastore
      "dcat", // DCAT metadata export
      "harvest", // harvesting framework
      "ckan_harvester", // CKAN-to-CKAN harvester
      "multilang", // multilingual support
      "multilang_harvester",
      "dcatapit_pkg", // Italian DCAT-AP_IT profile (dataset)
      "dcatapit_org", // Italian DCAT-AP_IT profile (organization)
      "dcatapit_config", // Italian DCAT-AP_IT profile (configuration)
      "ustat" // custom MUR USTAT extension
    ]
  },
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=status_show"
}
```

<br>

---

<br>

### `GET /license_list` - List available licenses

```java
/**
 * Returns the list of licenses configured in the portal. On the MUR USTAT
 * portal all datasets are published under IODL 2.0 (Italian Open Data
 * License v2.0).
 *
 * @param none
 * @return List<License> list of license objects on success,
 *         CKANError on failure
 */
GET /license_list
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": [
    {
      "id": "IODL-2.0", // license identifier (use in package_search fq)
      "title": "Italian Open Data License v2.0", // license display name
      "url": "http://www.dati.gov.it/content/italian-open-data-license-v20", // license URL
      "status": "active", // license status: active | retired
      "maintainer": "", // license maintainer (may be empty)
      "family": "", // license family (may be empty)
      "domain_data": true, // applicable to data
      "domain_content": false, // applicable to content
      "domain_software": false, // applicable to software
      "is_okd_compliant": false, // Open Knowledge Definition compliant
      "is_osi_compliant": false, // Open Source Initiative compliant
      "od_conformance": "not reviewed", // open data conformance status
      "osd_conformance": "not reviewed", // open source conformance status
      "is_generic": true // generic license flag
    }
  ],
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=license_list"
}
```

<br>

---

<br>

### `GET /vocabulary_list` - List controlled vocabularies

```java
/**
 * Returns all controlled tag vocabularies configured in the portal, with
 * the full list of terms for each one. Use the vocabulary id or name to
 * filter tag_list results to a specific vocabulary.
 *
 * @param none
 * @return List<Vocabulary> list of vocabulary objects with embedded tags on
 *         success, CKANError on failure
 */
GET /vocabulary_list
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": [
    {
      "id": "49716917-c59a-4be1-91a4-da5214d78d81", // vocabulary UUID
      "name": "languages", // vocabulary name (use in tag_list?vocabulary_id=)
      "tags": [
        {
          "id": "b377e024-6b44-44df-b7bb-c08890d42541", // tag UUID
          "name": "DEU", // ISO 639-2 language code
          "display_name": "DEU", // display label
          "vocabulary_id": "49716917-c59a-4be1-91a4-da5214d78d81" // parent vocabulary UUID
        },
        {
          "id": "6d698cf5-6c8a-4d58-a71c-6abc994e0ed7",
          "name": "ENG",
          "display_name": "ENG",
          "vocabulary_id": "49716917-c59a-4be1-91a4-da5214d78d81"
        },
        {
          "id": "69611090-504a-4efa-80cd-c005ddc23e39",
          "name": "FRA",
          "display_name": "FRA",
          "vocabulary_id": "49716917-c59a-4be1-91a4-da5214d78d81"
        },
        {
          "id": "75372d1d-2d58-4bc5-b4cd-6c1e0c2596ca",
          "name": "ITA",
          "display_name": "ITA",
          "vocabulary_id": "49716917-c59a-4be1-91a4-da5214d78d81"
        },
        {
          "id": "83493036-1132-4f07-b12b-8d9b82528fb0",
          "name": "SPA",
          "display_name": "SPA",
          "vocabulary_id": "49716917-c59a-4be1-91a4-da5214d78d81"
        }
      ]
    }
  ],
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=vocabulary_list"
}
```

<br>

---

<br>

### `GET /help_show` - Get inline action documentation

```java
/**
 * Returns the docstring of any CKAN action registered on this portal
 * instance. Use this endpoint to discover parameters not listed in this
 * documentation or to verify the exact behavior of the installed version.
 *
 * @param name string (query, required) - name of the CKAN action to look up;
 *                                        e.g. "package_show",
 *                                        "datastore_search"
 * @return string docstring of the requested action on success,
 *         CKANError on failure
 */
GET /help_show
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": "Search a DataStore resource.\n\n    The datastore_search action allows you to search data in a resource.\n    ...", // raw docstring of the requested action
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=help_show"
}
```

**`400 Bad Request`** - Action name not found.

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

- **Inline help:** `GET /api/3/action/help_show?name=status_show`
- **CKAN API documentation:** [docs.ckan.org - CKAN API guide](https://docs.ckan.org/en/latest/api/index.html)
- **IODL 2.0:** [dati.gov.it - Italian Open Data License v2.0](https://www.dati.gov.it/content/italian-open-data-license-v20)
- **MUR USTAT portal:** [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it)

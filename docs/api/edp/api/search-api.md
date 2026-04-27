---
title: EDP Search API | OhMyUniversity!
description: REST API documentation for the European Data Portal Search API - full-text search and filtering over dataset metadata.
head:
  - - meta
    - property: og:title
      content: EDP Search API | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the European Data Portal Search API - full-text search and filtering over dataset metadata.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/edp/api/search-api
  - - meta
    - name: keywords
      content: european data portal search api, edp search api, data.europa.eu search, dataset search europe, open data search api, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: EDP Search API | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the European Data Portal Search API - full-text search and filtering over dataset metadata.
---

# OhMyUniversity! - European Data Portal: Search API

**Base URL:** `https://data.europa.eu/api/hub/search`

The Search API provides high-performance **full-text search with filtering** over the metadata of all datasets indexed in the European Data Portal. It is the most practical entry point for discovering datasets programmatically, supporting keyword queries, country filters, format filters and pagination.

::: info Metadata only
This API returns **metadata records** - titles, descriptions, publishers, distribution download URLs - not the dataset files themselves. To retrieve actual data, follow the `access_url` values inside `distributions` and fetch the resource directly from the original publisher.
:::

::: warning Multilingual fields
`title`, `description`, and several other string fields are **language maps** (`{"en": "...", "it": "...", "da": "..."}`), not plain strings. Always access them by language key, e.g. `result.title["en"]`. Never assume a flat string.
:::

---

## Available endpoints

| Endpoint                     | Description                                  | Status    |
| ---------------------------- | -------------------------------------------- | --------- |
| [`GET /search`](#get-search) | Full-text search with filters and pagination | Available |

---

### `GET /search` - Search datasets

```java
/**
 * Searches the EDP metadata catalogue using a full-text query and optional
 * filters. Returns a paginated list of dataset metadata records in JSON.
 *
 * @param q      string  (query, optional) - free-text search term applied
 *                                           across titles, descriptions and
 *                                           keywords; omit to retrieve all
 *                                           datasets without filtering
 * @param page   integer (query, optional) - zero-based page index;
 *                                           defaults to 0
 * @param limit  integer (query, optional) - number of results per page;
 *                                           defaults to 10
 * @param locale string  (query, optional) - ISO 639-1 language code used
 *                                           to resolve translated fields
 *                                           in the response; defaults to "en"
 * @return SearchResult object containing total count and array of dataset
 *         metadata records on success
 */
GET /search
```

**Auth:** None · **Cache:** None

#### Example requests

Search by keyword, first page:

```http
GET https://data.europa.eu/api/hub/search/search?q=university&page=0&limit=10
```

Retrieve all datasets, paginate through them:

```http
GET https://data.europa.eu/api/hub/search/search?page=0&limit=10
GET https://data.europa.eu/api/hub/search/search?page=1&limit=10
GET https://data.europa.eu/api/hub/search/search?page=2&limit=10
```

#### Response

**`200 OK`**

```json
{
  "result": {
    "count": 12223, // total number of matching datasets across all pages
    "results": [
      {
        "id": "medarbejdere-ved-via-university-college", // dataset slug (URL-safe identifier)
        "index": "dataset", // always "dataset" for dataset records
        "resource": "http://data.europa.eu/88u/dataset/medarbejdere-ved-via-university-college",
        //           ^ canonical RDF URI - stable linked-data identifier for this dataset

        // --- Multilingual fields (language map: ISO 639-1 key → string value) ---
        "title": {
          "en": "Staff at VIA University College",
          "da": "Medarbejdere ved VIA University College",
          "it": "Personale del VIA University College"
          // ... up to 24 EU official languages
        },
        "description": {
          "da": "Medarbejdere ved VIA University College fordelt på Campus..."
          // may be {} (empty object) on some records - not guaranteed to have "en"
        },

        // --- Geography ---
        "country": {
          "id": "dk", // ISO 3166-1 alpha-2 country code
          "label": "Denmark",
          "resource": "http://publications.europa.eu/resource/authority/country/DNK"
        },

        // --- Keywords (each keyword carries its own language tag) ---
        "keywords": [
          {
            "id": "campus", // keyword slug
            "label": "Campus", // display value
            "language": "da" // language of this specific keyword entry
          },
          {
            "id": "køn",
            "label": "Køn",
            "language": "da"
          }
        ],

        // --- Categories (domain taxonomy; may be empty) ---
        "categories": [],

        // --- Quality and classification flags ---
        "is_hvd": false, // true if this is a High-Value Dataset (EU Reg. 2023/138)
        "quality_meas": null, // MQA quality score object; null if not yet computed

        // --- Publisher (at dataset level; may differ from the catalog publisher) ---
        "publisher": {
          "name": "Aarhus Kommune",
          "type": "Organization" // "Organization" | "Agent" | "Person"
        },

        // --- Contact point ---
        "contact_point": [
          {
            "name": "VIA it",
            "type": "Kind",
            "email": "mailto:support@via.dk" // always prefixed with "mailto:"
          }
        ],

        // --- Catalog record timestamps (harvesting history) ---
        "catalog_record": {
          "issued": "2021-10-15T08:09:14Z", // ISO 8601: first time this record was harvested
          "modified": "2024-06-11T18:40:03Z" // ISO 8601: most recent harvest/update
        },

        // --- Source catalog (the portal this dataset was harvested from) ---
        "catalog": {
          "id": "open-data-dk", // catalog slug
          "title": { "en": "OPEN DATA DK" }, // multilingual map
          "description": { "en": "OPEN DATA DK" },
          "homepage": "https://www.opendata.dk",
          "issued": "2022-06-24T12:31:35Z",
          "modified": "2023-02-11T18:40:11.518692",
          "source_type": "ckan", // harvesting protocol: see notes below
          "country": {
            "id": "dk",
            "label": "Denmark",
            "resource": "http://publications.europa.eu/resource/authority/country/DNK"
          },
          "spatial_resource": [
            {
              "id": "dk",
              "label": "Denmark",
              "resource": "http://publications.europa.eu/resource/authority/country/DNK"
            }
          ],
          "spatial": [], // additional coverage entries; may be empty
          "language": [
            {
              "id": "da",
              "label": "Danish",
              "resource": "http://publications.europa.eu/resource/authority/language/DAN"
            }
          ],
          "publisher": {
            "name": "Project Open Data Lab Aalborg",
            "type": "Agent",
            "homepage": "https://vbn.aau.dk/en/projects/open-data-education"
          }
        },

        // --- Distributions (one entry per downloadable file or resource) ---
        "distributions": [
          {
            "id": "619066f0-d13a-4678-8180-c577711fae2d", // distribution UUID
            "title": {
              "en": "Employees at VIA University College - Metadata.pdf",
              "da": "Medarbejdere ved VIA University College - Metadata.pdf"
              // multilingual map
            },
            "description": {
              "en": "Number of employees at VIA University College by campus, age group and gender.",
              "da": "Antal medarbejdere ved VIA University College fordelt på campus..."
              // may be {} (empty object) if no description is available for this distribution
            },
            "format": {
              "id": "CSV", // format code: "CSV" | "PDF" | "XLSX" | "JSON" | "TXT" | ...
              "label": "CSV",
              "resource": "http://publications.europa.eu/resource/authority/file-type/CSV"
            },
            "license": {
              "id": "https://creativecommons.org/licenses/by/4.0/",
              "label": "https://creativecommons.org/licenses/by/4.0/",
              //         ^ label may equal the URI itself when no human-readable label is provided
              "resource": "https://creativecommons.org/licenses/by/4.0/"
            },
            "access_url": [
              "https://admin.opendata.dk/dataset/.../download/file.csv"
              // always an array - even when there is only one URL
              // points to the resource on the original publisher's server
            ]
          }
        ],

        // --- Translation metadata ---
        "translation_meta": {
          "status": "completed", // "completed" | "pending" | "partial"
          "full_available_languages": [
            "en",
            "it",
            "de",
            "fr",
            "da",
            "pl",
            "el"
          ],
          //                           ^ all languages for which a translation exists
          "details": {
            "en": {
              "machine_translated": true, // false only for the original source language
              "original_language": "da", // the language this was translated from
              "issued": "2023-05-10T18:40:02Z",
              "received": "2023-05-10T18:44:51Z"
            },
            "da": {
              "machine_translated": false, // this is the original language
              // no "original_language" key present when machine_translated is false
              "issued": "2023-05-10T18:40:02Z",
              "received": "2023-05-10T18:44:51Z"
            }
          }
        }
      }
    ]
  }
}
```

---

## Notes on key fields

### `id` vs `resource`

The `id` is a **URL-safe slug** used as a human-readable identifier. The `resource` is the **canonical RDF URI** - the stable linked-data identifier. When building links to the EDP portal, use `resource`. When constructing API calls, the slug form in `id` is typically what path parameters expect.

### Multilingual fields

`title`, `description`, `catalog.title`, `catalog.description`, `distributions[].title`, and `distributions[].description` are all language maps. Not all keys are guaranteed - `description` in particular is often `{}` (empty object). Always apply a fallback:

```javascript
const title =
  dataset.title?.['en'] ??
  dataset.title?.[Object.keys(dataset.title ?? {})[0]] ??
  'Untitled';
```

### `distributions[].access_url`

Always an **array**. It points to the resource on the **original publisher's server** - availability, authentication, and format depend entirely on the source. There is no guarantee the URL is still active.

### `distributions[].license.label`

When the license has no human-readable label registered in the EDP vocabulary, `label` equals the license URI itself. Always check whether the label is a meaningful string before displaying it.

### `is_hvd`

`true` if the dataset is classified as a **High-Value Dataset** under EU Implementing Regulation 2023/138. HVDs come with stricter accessibility and quality requirements, making them more reliable for production use.

### `quality_meas`

When not `null`, contains the MQA (Metadata Quality Assurance) score for the dataset. The full MQA scoring dimensions (`findability`, `accessibility`, `interoperability`, `reusability`, `contextuality`) are documented in the [MQA API](./mqa-api).

### `catalog.source_type`

The protocol used to harvest this catalog:

| Value        | Description                               |
| ------------ | ----------------------------------------- |
| `ckan`       | Harvested from a CKAN-based portal        |
| `dcat`       | Harvested via a DCAT-AP feed              |
| `csw`        | Harvested from a CSW geospatial catalogue |
| `dataportal` | Direct EDP registered data provider       |

### `catalog_record` timestamps

These timestamps refer to **when the EDP harvested** the record, not when the original dataset was published or last updated by its creator. For dataset-level publication and modification dates, look in the Registry API response for `dct:issued` and `dct:modified` on the DCAT-AP record.

---

## References

- **Search API (Swagger/OpenAPI):** [data.europa.eu/api/hub/search](https://data.europa.eu/api/hub/search/)
- **EDP API documentation:** [dataeuropa.gitlab.io/data-provider-manual/api-documentation](https://dataeuropa.gitlab.io/data-provider-manual/api-documentation/)
- **Usage examples (Java, JS, Python, Ruby):** [gitlab.com/dataeuropa/api-usage-examples](https://gitlab.com/dataeuropa/api-usage-examples)
- **EDP portal:** [data.europa.eu](https://data.europa.eu)

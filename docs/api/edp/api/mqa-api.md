---
title: EDP MQA API | OhMyUniversity!
description: REST API documentation for the European Data Portal Metadata Quality Assurance (MQA) API - quality scores across five dimensions for datasets, catalogues and countries.
head:
  - - meta
    - property: og:title
      content: EDP MQA API | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the European Data Portal MQA API - quality scores for datasets, catalogues and countries across five DCAT-AP compliance dimensions.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/edp/api/mqa-api
  - - meta
    - name: keywords
      content: european data portal mqa, metadata quality assurance api, dcat-ap compliance, data.europa.eu quality, open data quality score, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: EDP MQA API | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the European Data Portal MQA API - quality scores for datasets, catalogues and countries across five DCAT-AP compliance dimensions.
---

# OhMyUniversity! - European Data Portal: MQA API

**Version:** `5.8.3` · **Base URL:** `https://data.europa.eu/api/mqa/cache`

The MQA (Metadata Quality Assurance) API provides **DCAT-AP compliance scores** for datasets, distributions, catalogues, countries and the portal as a whole. Scores measure how well metadata follows the DCAT-AP standard across five dimensions. The maximum total score is **450 points**.

::: info What MQA measures
MQA does not measure the quality of the data itself - it measures the quality of the **metadata description**. A dataset can contain perfect data and still score poorly if its publisher omitted dates, licenses, or spatial coverage.
:::

::: warning Three distinct response structures
The MQA API has **three structurally different response formats** depending on which endpoint group is called. See the [Response structure reference](#response-structure-reference) section before parsing.
:::

---

## Scoring dimensions

| Dimension            | Max points | What it checks                                                                         |
| -------------------- | ---------- | -------------------------------------------------------------------------------------- |
| **Findability**      | 100        | Keywords, categories, spatial and temporal coverage                                    |
| **Accessibility**    | 100        | Access URL reachability, download URL availability and reachability                    |
| **Interoperability** | 110        | Format, media type, non-proprietary/machine-readable formats, DCAT-AP SHACL compliance |
| **Reusability**      | 75         | License, license alignment, access rights, contact point, publisher                    |
| **Contextuality**    | 20         | Byte size, rights, issued/modified dates on dataset and distributions                  |
| **Total**            | **450**    | -                                                                                      |

---

## Available endpoints

| Endpoint                                                                                        | Description                                       | Response type     | Status    |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------- | --------- |
| [`GET /global`](#get-global)                                                                    | Global quality score across all datasets          | Aggregated        | Available |
| [`GET /global/history`](#get-globalhistory)                                                     | Historical global scores                          | History           | Available |
| [`GET /countries`](#get-countries)                                                              | Quality scores per country                        | Aggregated (list) | Available |
| [`GET /countries/{id}`](#get-countriesid)                                                       | Quality score for a specific country              | Aggregated        | Available |
| [`GET /countries/{id}/history`](#get-countriesidhistory)                                        | Historical scores for a country                   | History           | Available |
| [`GET /catalogues`](#get-catalogues)                                                            | Quality scores per catalogue                      | Aggregated (list) | Available |
| [`GET /catalogues/{id}`](#get-cataloguesid)                                                     | Quality score for a specific catalogue            | Aggregated        | Available |
| [`GET /catalogues/{id}/history`](#get-cataloguesidhistory)                                      | Historical scores for a catalogue                 | History           | Available |
| [`GET /catalogues/{id}/distributions/reachability`](#get-cataloguesiddistributionsreachability) | Unreachable URLs in a catalogue                   | -                 | Available |
| [`GET /catalogues/{id}/violations`](#get-cataloguesidviolations)                                | DCAT-AP SHACL violations in a catalogue           | -                 | Available |
| [`GET /datasets/{id}`](#get-datasetsid)                                                         | Quality score for a single dataset                | Dataset           | Available |
| [`GET /datasets/{id}/distributions`](#get-datasetsiddistributions)                              | Quality scores for all distributions of a dataset | Distribution      | Available |

::: warning Deprecated endpoint
`GET /distributions/{id}` is deprecated. Use `GET /datasets/{id}/distributions` instead.
:::

---

## Response structure reference

::: danger Critical - read before parsing
The MQA API uses **three structurally different response formats**. Mixing them up is the most common integration error. The format depends on which endpoint group you call:
:::

| Format           | Used by                                    | Dimension structure                     | Metrics type                              | Score location                |
| ---------------- | ------------------------------------------ | --------------------------------------- | ----------------------------------------- | ----------------------------- |
| **Aggregated**   | `/global`, `/countries/*`, `/catalogues/*` | Object `{ score, metric1, metric2... }` | `[{name, percentage}]` arrays             | Root-level `score` field      |
| **Dataset**      | `/datasets/{id}`                           | Array `[{ key: value }, ...]`           | Mixed: booleans OR `[{name, percentage}]` | Inside `info.score`           |
| **Distribution** | `/datasets/{id}/distributions`             | Array `[{ key: value }, ...]`           | Plain booleans or integers                | No score (per-indicator only) |

---

### `GET /global` - Global metrics

```java
/**
 * Returns the aggregated quality score across all datasets indexed in
 * the EDP. Uses the Aggregated response format.
 *
 * @param filter Array<string> (query, optional) - dimensions to include;
 *                                                  valid values: "findability",
 *                                                  "accessibility",
 *                                                  "interoperability",
 *                                                  "reusability",
 *                                                  "contextuality", "score";
 *                                                  omit to return all dimensions
 * @return MQAAggregatedResult global quality metrics across all catalogues
 */
GET /global
```

**Auth:** None · **Cache:** None

#### Example requests

All dimensions:

```http
GET https://data.europa.eu/api/mqa/cache/global
```

Score and findability only:

```http
GET https://data.europa.eu/api/mqa/cache/global?filter=score&filter=findability
```

#### Response

**`200 OK`** - Aggregated format

```json
{
  "success": true,
  "result": {
    "count": 1,
    "results": [
      {
        "score": 188.0, // total MQA score out of 450 - at root level, NOT inside a dimension

        // ── Findability (max 100 pts) ────────────────────────────────────────
        "findability": {
          "score": {
            "points": 68.0, // absolute points earned
            "percentage": 68.0, // points / max * 100
            "max": 100.0
          },
          "keywordAvailability": [
            { "name": "yes", "percentage": 88.0 },
            { "name": "no", "percentage": 12.0 }
          ],
          "categoryAvailability": [
            { "name": "yes", "percentage": 80.0 },
            { "name": "no", "percentage": 20.0 }
          ],
          "spatialAvailability": [
            { "name": "yes", "percentage": 66.0 },
            { "name": "no", "percentage": 34.0 }
          ],
          "temporalAvailability": [
            { "name": "yes", "percentage": 21.0 },
            { "name": "no", "percentage": 79.0 }
          ]
        },

        // ── Accessibility (max 100 pts) ──────────────────────────────────────
        "accessibility": {
          "score": { "points": 28.0, "percentage": 28.0, "max": 100.0 },
          "accessUrlStatusCodes": [
            // plural - note difference from /datasets/{id}
            { "name": "200", "percentage": 3.0 },
            { "name": "403", "percentage": 8.0 },
            { "name": "404", "percentage": 3.0 },
            { "name": "500", "percentage": 4.0 },
            { "name": "1100", "percentage": 82.0 } // 1100 = not checked / unreachable
          ],
          "accessUrlAccessibility": [
            { "name": "yes", "percentage": 40.0 },
            { "name": "no", "percentage": 60.0 }
            // may be null when data is unavailable (observed on /countries/ITA)
          ],
          "downloadUrlStatusCodes": [
            // plural - note difference from /datasets/{id}
            { "name": "200", "percentage": 4.0 },
            { "name": "204", "percentage": 2.0 },
            { "name": "403", "percentage": 8.0 },
            { "name": "404", "percentage": 4.0 },
            { "name": "1100", "percentage": 82.0 }
          ],
          "downloadUrlAccessibility": [
            { "name": "yes", "percentage": 13.0 },
            { "name": "no", "percentage": 87.0 }
            // may be null when data is unavailable
          ],
          "downloadUrlAvailability": [
            { "name": "yes", "percentage": 22.0 },
            { "name": "no", "percentage": 78.0 }
          ]
        },

        // ── Reusability (max 75 pts) ─────────────────────────────────────────
        "reusability": {
          "score": { "points": 38.0, "percentage": 51.0, "max": 75.0 },
          "licenceAvailability": [
            { "name": "yes", "percentage": 79.0 },
            { "name": "no", "percentage": 21.0 }
          ],
          "licenceAlignment": [
            { "name": "yes", "percentage": 6.0 },
            { "name": "no", "percentage": 94.0 }
          ],
          // ^ extra field vs /datasets/{id} - measures if license is from controlled vocabulary
          "accessRightsAvailability": [
            { "name": "yes", "percentage": 21.0 },
            { "name": "no", "percentage": 79.0 }
          ],
          "accessRightsAlignment": [
            { "name": "yes", "percentage": 17.0 },
            { "name": "no", "percentage": 83.0 }
          ],
          // ^ extra field vs /datasets/{id}
          "contactPointAvailability": [
            { "name": "yes", "percentage": 67.0 },
            { "name": "no", "percentage": 33.0 }
          ],
          "publisherAvailability": [
            { "name": "yes", "percentage": 55.0 },
            { "name": "no", "percentage": 45.0 }
          ]
        },

        // ── Contextuality (max 20 pts) ───────────────────────────────────────
        "contextuality": {
          "score": { "points": 10.0, "percentage": 50.0, "max": 20.0 },
          // note: flat structure here - no nested dataset/distributions sub-objects (unlike /datasets/{id})
          "byteSizeAvailability": [
            { "name": "yes", "percentage": 13.0 },
            { "name": "no", "percentage": 87.0 }
          ],
          "rightsAvailability": [
            { "name": "yes", "percentage": 26.0 },
            { "name": "no", "percentage": 74.0 }
          ],
          "dateIssuedAvailability": [
            { "name": "yes", "percentage": 69.0 },
            { "name": "no", "percentage": 31.0 }
          ],
          "dateModifiedAvailability": [
            { "name": "yes", "percentage": 70.0 },
            { "name": "no", "percentage": 30.0 }
          ]
        },

        // ── Interoperability (max 110 pts) ───────────────────────────────────
        "interoperability": {
          "score": { "points": 44.0, "percentage": 40.0, "max": 110.0 },
          "formatAvailability": [
            { "name": "yes", "percentage": 82.0 },
            { "name": "no", "percentage": 18.0 }
          ],
          "mediaTypeAvailability": [
            { "name": "yes", "percentage": 27.0 },
            { "name": "no", "percentage": 73.0 }
          ],
          "formatMediaTypeAlignment": [
            { "name": "yes", "percentage": 67.0 },
            { "name": "no", "percentage": 33.0 }
          ],
          // ^ named "formatMediaTypeAlignment" here, NOT "formatMediaTypeVocabularyAlignment" as in /datasets/{id}
          "formatMediaTypeNonProprietary": [
            { "name": "yes", "percentage": 42.0 },
            { "name": "no", "percentage": 58.0 }
          ],
          // ^ extra field vs /datasets/{id}
          "formatMediaTypeMachineReadable": [
            { "name": "yes", "percentage": 18.0 },
            { "name": "no", "percentage": 82.0 }
          ],
          // ^ extra field vs /datasets/{id}
          "dcatApCompliance": [
            { "name": "yes", "percentage": 18.0 },
            { "name": "no", "percentage": 82.0 }
          ]
          // may be null for some catalogues
        }
      }
    ]
  }
}
```

<br>

---

<br>

### `GET /global/history` - Historical global metrics

```java
/**
 * Returns the time series of global quality scores between two dates.
 *
 * @param startDate  string        (query, required) - start date ISO format
 *                                                     e.g. "2023-1-1"
 * @param endDate    string        (query, optional) - end date ISO format;
 *                                                     defaults to current date
 * @param resolution string        (query, optional) - time granularity;
 *                                                     "year" | "month" | "day";
 *                                                     defaults to "month"
 * @param filter     Array<string> (query, optional) - dimensions to include
 * @return MQAHistoryResult time series of global quality metrics
 */
GET /global/history
```

**Auth:** None · **Cache:** None

#### Example request

```http
GET https://data.europa.eu/api/mqa/cache/global/history?startDate=2023-1-1&endDate=2024-12-31&resolution=month
```

<br>

---

<br>

### `GET /countries` - All country metrics

```java
/**
 * Returns the aggregated quality score for each country, grouped by
 * ISO 3166-1 ALPHA-3 country code. Uses the Aggregated response format.
 * Include filter=info to return the country info object alongside scores.
 *
 * @param filter Array<string> (query, optional) - dimensions to include;
 *                                                  also accepts "info"
 * @return List<MQAAggregatedResult> one result per country
 */
GET /countries
```

**Auth:** None · **Cache:** None

#### Example request

```http
GET https://data.europa.eu/api/mqa/cache/countries?filter=score&filter=info
```

<br>

---

<br>

### `GET /countries/{id}` - Single country metrics

```java
/**
 * Returns the aggregated quality score for a single country.
 * Uses the Aggregated response format. The info object contains
 * only the country id (ISO 3166-1 ALPHA-3) - no title or description.
 *
 * @param id     string        (path, required)  - ISO 3166-1 ALPHA-3
 *                                                 country code (e.g. "ITA")
 * @param filter Array<string> (query, optional) - dimensions to include;
 *                                                  also accepts "info"
 * @return MQAAggregatedResult quality metrics for the specified country,
 *         or 404 if not found
 */
GET /countries/{id}
```

**Auth:** None · **Cache:** None

#### Example request

```http
GET https://data.europa.eu/api/mqa/cache/countries/ITA
```

#### Response

**`200 OK`** - Aggregated format (same structure as `/global`, with these differences)

```json
{
  "success": true,
  "result": {
    "count": 1,
    "results": [
      {
        "score": 316.0,

        // info object - present only when filter=info or no filter specified
        "info": {
          "id": "ITA" // ISO 3166-1 ALPHA-3 only - no title or description
        },

        "findability": {
          "score": { "points": 94.0, "percentage": 94.0, "max": 100.0 }
          // ...same metric fields as /global
        },

        "accessibility": {
          "score": { "points": 61.0, "percentage": 61.0, "max": 100.0 },
          "accessUrlAccessibility": null, // may be null - handle defensively
          "downloadUrlAccessibility": null // may be null - handle defensively
          // ...other metric fields as /global
        }

        // ...reusability, contextuality, interoperability as /global
      }
    ]
  }
}
```

<br>

---

<br>

### `GET /countries/{id}/history` - Historical country metrics

```java
/**
 * Returns the time series of quality scores for a specific country.
 *
 * @param id         string        (path, required)  - ISO 3166-1 ALPHA-3 code
 * @param startDate  string        (query, required) - start date ISO format
 * @param endDate    string        (query, optional) - defaults to current date
 * @param resolution string        (query, optional) - "year"|"month"|"day";
 *                                                     defaults to "month"
 * @param filter     Array<string> (query, optional) - dimensions to include
 * @return MQAHistoryResult time series for this country
 */
GET /countries/{id}/history
```

**Auth:** None · **Cache:** None

<br>

---

<br>

### `GET /catalogues` - All catalogue metrics

```java
/**
 * Returns the aggregated quality score for each catalogue registered
 * in the EDP. Uses the Aggregated response format.
 * The info object (filter=info) contains id, title, description,
 * spatial and source type - richer than the country info object.
 *
 * @param filter Array<string> (query, optional) - dimensions to include;
 *                                                  also accepts "info"
 * @return List<MQAAggregatedResult> one result per catalogue
 */
GET /catalogues
```

**Auth:** None · **Cache:** None

<br>

---

<br>

### `GET /catalogues/{id}` - Single catalogue metrics

```java
/**
 * Returns the aggregated quality score for a single catalogue.
 * Uses the Aggregated response format. The info object is richer
 * than the country equivalent: it includes title, description,
 * spatial coverage and source type.
 *
 * @param id     string        (path, required)  - catalogue ID
 *                                                 (e.g. "open-data-dk", "estat")
 * @param filter Array<string> (query, optional) - dimensions to include;
 *                                                  also accepts "info"
 * @return MQAAggregatedResult quality metrics for the catalogue,
 *         or 404 if not found
 */
GET /catalogues/{id}
```

**Auth:** None · **Cache:** None

#### Example request

```http
GET https://data.europa.eu/api/mqa/cache/catalogues/open-data-dk
```

#### Response

**`200 OK`** - Aggregated format (same structure as `/global`, with these differences)

```json
{
  "success": true,
  "result": {
    "count": 1,
    "results": [
      {
        "score": 157.0,

        // info object - richer than country info
        "info": {
          "id": "open-data-dk",
          "title": "OPEN DATA DK",
          "description": "OPEN DATA DK",
          "spatial": "DNK", // ISO 3166-1 ALPHA-3 spatial coverage
          "type": "ckan" // harvesting protocol: "ckan" | "dcat" | ...
        },

        "interoperability": {
          "score": { "points": 54.0, "percentage": 49.0, "max": 110.0 },
          "dcatApCompliance": null // may be null for some catalogues - handle defensively
          // ...other fields as /global
        }

        // ...findability, accessibility, reusability, contextuality as /global
      }
    ]
  }
}
```

<br>

---

<br>

### `GET /catalogues/{id}/history` - Historical catalogue metrics

```java
/**
 * Returns the time series of quality scores for a specific catalogue.
 *
 * @param id         string        (path, required)  - catalogue ID
 * @param startDate  string        (query, required) - start date ISO format
 * @param endDate    string        (query, optional) - defaults to current date
 * @param resolution string        (query, optional) - "year"|"month"|"day"
 * @param filter     Array<string> (query, optional) - dimensions to include
 * @return MQAHistoryResult time series for this catalogue
 */
GET /catalogues/{id}/history
```

**Auth:** None · **Cache:** None

<br>

---

<br>

### `GET /catalogues/{id}/distributions/reachability` - Unreachable URLs

```java
/**
 * Returns the list of distributions in a catalogue whose access URL or
 * download URL returned an error status code at the last metrics refresh.
 *
 * @param id     string  (path, required)  - catalogue ID
 * @param offset integer (query, optional) - pagination offset; defaults to 0
 * @param limit  integer (query, optional) - max results; defaults to 100
 * @param locale string  (query, optional) - language for dataset title
 * @return List of distribution records with error status codes
 */
GET /catalogues/{id}/distributions/reachability
```

**Auth:** None · **Cache:** None

<br>

---

<br>

### `GET /catalogues/{id}/violations` - DCAT-AP SHACL violations

```java
/**
 * Returns the list of datasets in a catalogue that have structural
 * DCAT-AP SHACL compliance violations.
 *
 * @param id     string  (path, required)  - catalogue ID
 * @param offset integer (query, optional) - pagination offset; defaults to 0
 * @param limit  integer (query, optional) - max results; defaults to 100
 * @param locale string  (query, optional) - language for dataset title
 * @return List of datasets with SHACL violation details
 */
GET /catalogues/{id}/violations
```

**Auth:** None · **Cache:** None

<br>

---

<br>

### `GET /datasets/{id}` - Single dataset metrics

```java
/**
 * Returns the MQA quality score for a single dataset across all five
 * dimensions. Uses the Dataset response format - structurally different
 * from the Aggregated format used by /global, /countries and /catalogues.
 * Dimensions are arrays of indicator objects, not nested objects with score.
 *
 * @param id     string (path, required)  - dataset slug
 *                                          (e.g. "medarbejdere-ved-via-university-college")
 * @param locale string (query, optional) - language for dataset title
 * @return DatasetMQAResult full quality metrics, or 404 if not found
 */
GET /datasets/{id}
```

**Auth:** None · **Cache:** None

#### Example request

```http
GET https://data.europa.eu/api/mqa/cache/datasets/medarbejdere-ved-via-university-college
```

#### Response

**`200 OK`** - Dataset format

```json
{
  "success": true,
  "result": {
    "count": 1,
    "results": [
      {
        // ── Dataset identity + total score ────────────────────────────────────
        "info": {
          "dataset-id": "medarbejdere-ved-via-university-college",
          "dataset-uri": "http://data.europa.eu/88u/dataset/medarbejdere-ved-via-university-college",
          "score": 180 // total MQA score out of 450 - inside info, NOT at root level
        },

        // ── Findability - array of indicator objects, values are plain booleans ──
        "findability": [
          { "keywordAvailability": true },
          { "categoryAvailability": true },
          { "spatialAvailability": false },
          { "temporalAvailability": false }
        ],

        // ── Accessibility - array of indicator objects, values are {name, percentage} arrays ──
        "accessibility": [
          {
            "downloadUrlAvailability": [
              { "name": "yes", "percentage": 0.0 },
              { "name": "no", "percentage": 100.0 }
            ]
          },
          { "accessUrlStatusCode": [{ "name": "1100", "percentage": 100.0 }] },
          // ^ singular "accessUrlStatusCode" - NOT plural as in /global
          { "downloadUrlStatusCode": [] }
          // ^ empty array when no downloadURLs present
        ],

        // ── Reusability - array, booleans and {name, percentage} arrays mixed ──
        "reusability": [
          { "accessRightsAvailability": false }, // plain boolean
          {
            "licenceAvailability": [
              { "name": "yes", "percentage": 100.0 },
              { "name": "no", "percentage": 0.0 }
            ]
          },
          { "accessRightsVocabularyAlignment": false },
          // ^ named "accessRightsVocabularyAlignment" here - NOT "accessRightsAlignment" as in /global
          { "contactPointAvailability": true },
          { "publisherAvailability": true }
          // note: no licenceAlignment, no accessRightsAlignment fields here
        ],

        // ── Contextuality - nested structure unique to this endpoint ──────────
        "contextuality": [
          {
            "byteSizeAvailability": [
              { "name": "yes", "percentage": 0.0 },
              { "name": "no", "percentage": 100.0 }
            ]
          },
          {
            "rightsAvailability": [
              { "name": "yes", "percentage": 0.0 },
              { "name": "no", "percentage": 100.0 }
            ]
          },
          {
            "dataset": [
              // dataset-level date fields - sub-array
              { "dateModifiedAvailability": false },
              { "dateIssuedAvailability": false }
            ]
          },
          {
            "distributions": [
              // distribution-level date fields - sub-array
              {
                "dateModifiedAvailability": [
                  { "name": "yes", "percentage": 0.0 },
                  { "name": "no", "percentage": 100.0 }
                ]
              },
              {
                "dateIssuedAvailability": [
                  { "name": "yes", "percentage": 0.0 },
                  { "name": "no", "percentage": 100.0 }
                ]
              }
            ]
          }
        ],

        // ── Interoperability ─────────────────────────────────────────────────
        "interoperability": [
          { "dcatApCompliance": {} },
          // ^ empty object {} = no violations; contrast with /global where it's [{name,percentage}]
          {
            "formatAvailability": [
              { "name": "yes", "percentage": 100.0 },
              { "name": "no", "percentage": 0.0 }
            ]
          },
          {
            "mediaTypeAvailability": [
              { "name": "yes", "percentage": 0.0 },
              { "name": "no", "percentage": 100.0 }
            ]
          },
          {
            "formatMediaTypeVocabularyAlignment": [
              { "name": "yes", "percentage": 100.0 },
              { "name": "no", "percentage": 0.0 }
            ]
          }
          // ^ named "formatMediaTypeVocabularyAlignment" here - NOT "formatMediaTypeAlignment" as in /global
          // note: no formatMediaTypeNonProprietary or formatMediaTypeMachineReadable fields
        ]
      }
    ]
  }
}
```

**`404 Not Found`**

```json
{ "success": false, "result": null }
```

<br>

---

<br>

### `GET /datasets/{id}/distributions` - Distribution metrics

```java
/**
 * Returns the MQA quality metrics for each individual distribution of
 * the specified dataset. Uses the Distribution response format -
 * all metrics are plain booleans or integers, no percentage arrays.
 * Includes a validation sub-object with CSV linting results.
 *
 * The result is an array of arrays: the outer array has one entry per
 * distribution; each inner array contains exactly one metric object.
 *
 * @param id     string (path, required)  - dataset slug
 * @param locale string (query, optional) - language for distribution title
 * @return List<List<DistributionMQAResult>> metrics per distribution,
 *         or 404 if dataset not found
 */
GET /datasets/{id}/distributions
```

**Auth:** None · **Cache:** None

#### Example request

```http
GET https://data.europa.eu/api/mqa/cache/datasets/medarbejdere-ved-via-university-college/distributions
```

#### Response

**`200 OK`** - Distribution format

::: warning Outer array of arrays
`result.results` is an **array of arrays**. Each outer element corresponds to one distribution and contains a single-element inner array with the metrics object. Always iterate with `results.forEach(distArr => { const dist = distArr[0]; ... })`.
:::

```json
{
  "success": true,
  "result": {
    "count": 4, // number of distributions
    "results": [
      [
        // outer array entry = one distribution
        {
          // inner array always has exactly one element
          // ── Distribution identity ───────────────────────────────────────────
          "info": {
            "distribution-id": "fb633dda-7f49-4904-b323-216f63b63d6c",
            "distribution-uri": "http://data.europa.eu/88u/distribution/fb633dda-7f49-4904-b323-216f63b63d6c",
            "distribution-title": "Dipendenti del VIA University College - Descrizione dei datasets.pdf"
            // title uses the locale parameter if specified, otherwise picks a default language
          },

          // ── Accessibility - array of indicator objects, plain values ────────
          "accessibility": [
            { "downloadUrlAvailability": false }, // plain boolean
            { "accessUrlStatusCode": 1100 }, // plain integer, NOT array
            { "downloadUrlStatusCode": {} } // empty object {} when N/A (no download URL)
          ],

          // ── Reusability ─────────────────────────────────────────────────────
          "reusability": [
            { "licenceAvailability": true } // plain boolean
          ],

          // ── Contextuality ────────────────────────────────────────────────────
          "contextuality": [
            { "byteSizeAvailability": false },
            { "rightsAvailability": false },
            { "dateModifiedAvailability": false },
            { "dateIssuedAvailability": false }
          ],

          // ── Interoperability ─────────────────────────────────────────────────
          "interoperability": [
            { "formatAvailability": true },
            { "mediaTypeAvailability": false },
            { "formatMediaTypeVocabularyAlignment": true }
          ],

          // ── Validation (CSV linting) - unique to distribution endpoint ───────
          "validation": {
            "errors": {
              "count": 0,
              "items": [] // array of error objects when count > 0
            },
            "warnings": {
              "count": 0,
              "items": []
            },
            "infos": {
              "count": 0,
              "items": []
            },
            "itemCount": 0 // total rows checked in CSV
          }
        }
      ]
      // ... one outer entry per distribution
    ]
  }
}
```

---

## Notes on key fields

### Score location differs by endpoint

| Endpoint group                             | Score location                                        |
| ------------------------------------------ | ----------------------------------------------------- |
| `/global`, `/countries/*`, `/catalogues/*` | Root-level `score` field (e.g. `result.score: 188.0`) |
| `/datasets/{id}`                           | Inside `info.score` (e.g. `result.info.score: 180`)   |
| `/datasets/{id}/distributions`             | Not present - no total score per distribution         |

### Score ranges

| Range     | Quality level |
| --------- | ------------- |
| 351 – 450 | Excellent     |
| 221 – 350 | Good          |
| 121 – 220 | Sufficient    |
| 0 – 120   | Bad           |

### Field name differences between endpoint groups

Several fields share the same concept but use different names depending on the endpoint:

| Concept                     | `/global`, `/countries`, `/catalogues`        | `/datasets/{id}`                           | `/datasets/{id}/distributions`        |
| --------------------------- | --------------------------------------------- | ------------------------------------------ | ------------------------------------- |
| Access URL status           | `accessUrlStatusCodes` (plural)               | `accessUrlStatusCode` (singular)           | `accessUrlStatusCode` (integer)       |
| Download URL status         | `downloadUrlStatusCodes` (plural)             | `downloadUrlStatusCode` (singular)         | `downloadUrlStatusCode` ({} when N/A) |
| Format/media type alignment | `formatMediaTypeAlignment`                    | `formatMediaTypeVocabularyAlignment`       | `formatMediaTypeVocabularyAlignment`  |
| Access rights vocabulary    | `accessRightsAlignment`                       | `accessRightsVocabularyAlignment`          | -                                     |
| DCAT-AP compliance          | `dcatApCompliance` (`[{name,pct}]` or `null`) | `dcatApCompliance` (`{}` or violation obj) | -                                     |

### Nullable fields

The following fields can be `null` and must always be handled defensively:

- `accessibility.accessUrlAccessibility` - null observed on `/countries/ITA`
- `accessibility.downloadUrlAccessibility` - null observed on `/countries/ITA`
- `interoperability.dcatApCompliance` - null observed on `/catalogues/open-data-dk`

### `filter` parameter

All list and single-item endpoints accept repeated `filter` parameters to restrict which dimensions are returned:

```http
GET /global?filter=findability&filter=score
GET /countries/ITA?filter=reusability&filter=contextuality&filter=info
```

### `accessUrlStatusCode` value `1100`

EDP custom code - not a standard HTTP status:

| Code             | Meaning                                        |
| ---------------- | ---------------------------------------------- |
| `200`            | URL reachable                                  |
| `1100`           | URL not checked or unreachable at last refresh |
| `404`            | Not found                                      |
| Other HTTP codes | Standard HTTP semantics                        |

---

## References

- **MQA API (Swagger/OpenAPI):** [data.europa.eu/api/mqa/cache/index.html](https://data.europa.eu/api/mqa/cache/index.html)
- **EDP API documentation:** [dataeuropa.gitlab.io/data-provider-manual/api-documentation](https://dataeuropa.gitlab.io/data-provider-manual/api-documentation/)
- **DCAT-AP SHACL constraints:** [joinup.ec.europa.eu - DCAT-AP](https://joinup.ec.europa.eu/collection/semantic-interoperability-community-semic/solution/dcat-application-profile-data-portals-europe)
- **W3C Data Quality Vocabulary (DQV):** [w3.org/TR/vocab-dqv](https://www.w3.org/TR/vocab-dqv/)
- **EDP portal:** [data.europa.eu](https://data.europa.eu)

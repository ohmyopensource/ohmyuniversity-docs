---
title: EDP Registry API | OhMyUniversity!
description: REST API documentation for the European Data Portal Registry API - direct access to DCAT-AP metadata in JSON-LD and other RDF formats.
head:
  - - meta
    - property: og:title
      content: EDP Registry API | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the European Data Portal Registry API - direct access to DCAT-AP metadata in JSON-LD and other RDF formats.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/edp/api/registry-api
  - - meta
    - name: keywords
      content: european data portal registry api, edp registry, dcat-ap json-ld, data.europa.eu rdf, dataset metadata rdf, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: EDP Registry API | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the European Data Portal Registry API - direct access to DCAT-AP metadata in JSON-LD and other RDF formats.
---

# OhMyUniversity! - European Data Portal: Registry API

**Base URL:** `https://data.europa.eu/api/hub/repo`

The Registry API gives direct access to the **DCAT-AP RDF representation** of dataset metadata stored in the EDP. Unlike the Search API - which returns flat JSON optimized for search - the Registry API returns the full semantic metadata graph in standard RDF formats (JSON-LD by default). It is the appropriate choice when you need complete, structured DCAT-AP records, or when you want to integrate with Linked Data tools.

::: warning Different paradigm from the Search API
The Registry API does **not** return plain JSON objects. Responses are **JSON-LD graphs** - a standard for representing RDF data in JSON. The root of the response is `@graph` (an array of interconnected nodes) plus `@context` (the vocabulary prefixes). Nodes reference each other via `@id`. Do not expect flat key-value records as in the Search API.
:::

::: info Metadata only
As with all EDP APIs, this API returns **metadata**, not the actual dataset files. Download URLs are found in `dcat:accessURL` inside `dcat:Distribution` nodes.
:::

---

## Available endpoints

| Endpoint                                 | Description                               | Status           |
| ---------------------------------------- | ----------------------------------------- | ---------------- |
| [`GET /datasets`](#get-datasets)         | List dataset URIs (identifiers only)      | Available · slow |
| [`GET /datasets/{id}`](#get-datasets-id) | Full DCAT-AP metadata of a single dataset | Available        |
| [`GET /catalogues`](#get-catalogues)     | List catalogue URIs                       | Available        |

---

### `GET /datasets` - List dataset identifiers

```java
/**
 * Returns a paginated list of dataset URIs (or slugs) harvested
 * in the EDP. This endpoint is useful for bulk discovery but is
 * notably slow - responses may take several seconds even for small
 * limits. Use the Search API for interactive discovery.
 *
 * @param limit     integer (query, optional) - number of entries to return;
 *                                              defaults to 50
 * @param valueType string  (query, optional) - controls the format of the
 *                                              returned identifiers;
 *                                              "identifiers" returns
 *                                              slug-style strings,
 *                                              omitting returns full URIs
 * @return List<string> array of dataset identifiers or URIs
 */
GET /datasets
```

**Auth:** None · **Cache:** None

::: warning Performance
This endpoint is significantly slower than the Search API. For interactive or paginated discovery, always prefer `GET /search` in the Search API.
:::

#### Example requests

Get 50 dataset slugs:

```http
GET https://data.europa.eu/api/hub/repo/datasets?limit=50&valueType=identifiers
```

Get 50 full dataset URIs (default, no valueType):

```http
GET https://data.europa.eu/api/hub/repo/datasets?limit=50
```

#### Response

**`200 OK`** - with `valueType=identifiers`:

```json
[
  "-",
  "-00078c62-9096-4b24-9233-5f041d2dce5c-"
  // slug strings; pass these as {id} to GET /datasets/{id}
]
```

**`200 OK`** - without `valueType` (full URIs):

```json
[
  "http://data.europa.eu/88u/catalogue/nsip-cz",
  "http://data.europa.eu/88u/catalogue/eurogeographics"
]
```

<br>

---

<br>

### `GET /datasets/{id}` - Get dataset metadata

```java
/**
 * Returns the complete DCAT-AP metadata record for a single dataset,
 * serialised as JSON-LD by default. The response is a flat @graph
 * containing all related nodes: the dataset itself, its distributions,
 * the license document, the publisher (foaf:Organization) and the
 * contact point (vcard:Kind).
 *
 * Nodes within the @graph cross-reference each other via @id pointers.
 * The dataset node lists its distributions as an array of { "@id": "..." }
 * references; the full distribution objects appear as separate nodes in
 * the same @graph.
 *
 * A different RDF serialisation can be requested by appending a file
 * extension to the path (see serialisation formats below).
 *
 * @param id string (path, required) - dataset slug (from /datasets list
 *                                     or Search API result.id) or full
 *                                     URI slug after /88u/dataset/
 * @return JSON-LD graph object containing the dataset and all related
 *         nodes, or 404 if not found
 */
GET /datasets/{id}
```

**Auth:** None · **Cache:** None

#### Serialisation formats

By default the response is JSON-LD. Append an extension to request a different RDF format:

| Extension | Format    | Content-Type            |
| --------- | --------- | ----------------------- |
| _(none)_  | JSON-LD   | `application/ld+json`   |
| `.ttl`    | Turtle    | `text/turtle`           |
| `.nt`     | N-Triples | `application/n-triples` |
| `.xml`    | RDF/XML   | `application/rdf+xml`   |

```http
GET https://data.europa.eu/api/hub/repo/datasets/medarbejdere-ved-via-university-college
GET https://data.europa.eu/api/hub/repo/datasets/medarbejdere-ved-via-university-college.ttl
```

#### Response

**`200 OK`** - JSON-LD (default)

The response root always has two keys: `@context` (vocabulary prefix map) and `@graph` (array of nodes). The graph contains one `dcat:Dataset` node plus all related nodes inlined: distributions, license document, publisher and contact point.

```json
{
  "@context": {
    "vcard": "http://www.w3.org/2006/vcard/ns#",
    "dct": "http://purl.org/dc/terms/",
    "dcat": "http://www.w3.org/ns/dcat#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "foaf": "http://xmlns.com/foaf/0.1/"
    // vocabulary prefix declarations - needed to resolve all property names in @graph
  },
  "@graph": [
    // ── dcat:Dataset ──────────────────────────────────────────────────────────
    {
      "@id": "http://data.europa.eu/88u/dataset/medarbejdere-ved-via-university-college",
      "@type": "dcat:Dataset",

      "dct:title": [
        {
          "@language": "en-t-da-t0-mtec",
          "@value": "Staff at VIA University College"
        },
        {
          "@language": "da",
          "@value": "Medarbejdere ved VIA University College"
        }
        // one entry per language; see language tag notes below
      ],

      "dct:description": {
        // when only one language is present, this is a single object (not an array)
        "@language": "da",
        "@value": "Medarbejdere ved VIA University College fordelt på Campus..."
        // when multiple languages are present it becomes an array of { @language, @value }
      },

      "dcat:keyword": [
        { "@language": "da", "@value": "Campus" },
        { "@language": "da", "@value": "Køn" },
        { "@language": "da", "@value": "Alder" }
        // keywords carry the language of the original source only - no MT versions
      ],

      "dcat:theme": {
        "@id": "http://publications.europa.eu/resource/authority/data-theme/undefined"
        // URI reference to EuroVoc data theme; may be "undefined" if not classified
      },

      "dcat:distribution": [
        {
          "@id": "http://data.europa.eu/88u/distribution/619066f0-d13a-4678-8180-c577711fae2d"
        },
        {
          "@id": "http://data.europa.eu/88u/distribution/ea08268c-ef52-4ce9-82bf-e082a2df7a18"
        }
        // @id pointers - resolve by matching against @id of dcat:Distribution nodes in @graph
      ],

      "dcat:contactPoint": {
        "@id": "_:b5753bb16eb0ad2151da2723e5570d6e"
        // blank node reference - resolved by matching @id in vcard:Kind node below
      },

      "dct:publisher": {
        "@id": "_:1da0af06fe32d77ae1a2004bfc1a9e2d"
        // blank node reference - resolved by matching @id in foaf:Organization node below
      }
    },

    // ── dcat:Distribution (one node per file/resource) ────────────────────────
    {
      "@id": "http://data.europa.eu/88u/distribution/ea08268c-ef52-4ce9-82bf-e082a2df7a18",
      "@type": "dcat:Distribution",

      "dct:identifier": "2a3532fa-a497-4780-a77e-9c46e525a1d9", // UUID from source portal

      "dct:title": [
        {
          "@language": "en-t-da-t0-mtec",
          "@value": "Staff at VIA University College.csv"
        },
        {
          "@language": "da",
          "@value": "Medarbejdere ved VIA University College.csv"
        }
      ],

      "dct:description": [
        {
          "@language": "en-t-da-t0-mtec",
          "@value": "Number of employees at VIA University College by campus, age group and gender."
        },
        {
          "@language": "da",
          "@value": "Antal medarbejdere ved VIA University College fordelt på campus, aldersgruppe og køn."
        }
        // may be a single { @language, @value } object instead of array when only one language
        // may be { "@language": "da", "@value": "" } (empty string) when no description provided
      ],

      "dct:format": {
        "@id": "http://publications.europa.eu/resource/authority/file-type/CSV"
        // URI reference to EU file-type authority table
      },

      "dct:license": {
        "@id": "https://creativecommons.org/licenses/by/4.0/"
        // URI reference - resolved by matching @id in dct:LicenseDocument node below
      },

      "dcat:accessURL": {
        "@id": "https://admin.opendata.dk/dataset/fbab06e3-.../download/medarbejdere-ved-via-university-college.csv"
        // direct URL to the resource on the original publisher's server
        // note: single @id object, not an array (unlike Search API access_url)
      }
    },

    // ── dct:LicenseDocument ───────────────────────────────────────────────────
    {
      "@id": "https://creativecommons.org/licenses/by/4.0/",
      "@type": "dct:LicenseDocument",
      "dct:identifier": "CC-BY-4.0",
      "dct:title": "Creative Commons Attribution 4.0" // plain string here, not a language map
    },

    // ── vcard:Kind (contact point) ────────────────────────────────────────────
    {
      "@id": "_:b5753bb16eb0ad2151da2723e5570d6e", // blank node (local scope only)
      "@type": "vcard:Kind",
      "vcard:fn": "VIA it", // contact name
      "vcard:hasEmail": {
        "@id": "mailto:support@via.dk" // always "mailto:" prefixed
      }
    },

    // ── foaf:Organization (publisher) ─────────────────────────────────────────
    {
      "@id": "_:1da0af06fe32d77ae1a2004bfc1a9e2d", // blank node (local scope only)
      "@type": "foaf:Organization",
      "foaf:name": "Aarhus Kommune",
      "dct:type": {
        "@id": "http://purl.org/adms/publishertype/NationalAuthority"
        // ADMS publisher type URI
      }
    }
  ]
}
```

**`404 Not Found`** - dataset not found or ID invalid:

```json
// Empty response body or HTTP 404 status with no JSON payload
```

<br>

---

<br>

### `GET /catalogues` - List catalogue identifiers

```java
/**
 * Returns a paginated list of catalogue URIs registered in the EDP.
 * Each URI identifies a national or institutional open data portal
 * that the EDP harvests from. Pass a URI to a catalogue-specific
 * endpoint to retrieve its metadata (not documented here - refer to
 * the Swagger UI for available catalogue sub-endpoints).
 *
 * @param limit integer (query, optional) - number of entries to return
 * @return List<string> array of catalogue URIs
 */
GET /catalogues
```

**Auth:** None · **Cache:** None

#### Example request

```http
GET https://data.europa.eu/api/hub/repo/catalogues?limit=2
```

#### Response

**`200 OK`**

```json
[
  "http://data.europa.eu/88u/catalogue/nsip-cz",
  "http://data.europa.eu/88u/catalogue/eurogeographics"
  // full RDF URIs identifying each harvested catalogue
]
```

---

## Notes on key fields

### JSON-LD `@graph` structure

The response is not a single flat object. It is a **graph of nodes**, each with its own `@id` and `@type`. The `dcat:Dataset` node references its distributions, publisher and contact point via `@id` pointers - you must resolve these by finding the matching node in the `@graph` array. There is no nesting: everything is flat in the graph.

```javascript
const graph = response['@graph'];
const dataset = graph.find((n) => n['@type'] === 'dcat:Dataset');
const distributions = dataset['dcat:distribution'].map((ref) =>
  graph.find((n) => n['@id'] === ref['@id']),
);
```

### Language tags - BCP47 with MT extension

Language tags in `@language` fields follow [BCP 47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) with a private-use extension for machine-translated values:

| Tag               | Meaning                                 |
| ----------------- | --------------------------------------- |
| `da`              | Original Danish text                    |
| `en-t-da-t0-mtec` | English, machine-translated from Danish |
| `it-t-da-t0-mtec` | Italian, machine-translated from Danish |

The pattern is: `{target_lang}-t-{source_lang}-t0-mtec`. To get human-authored text, filter for tags **without** the `-t-` extension. To get a specific language regardless of origin, match any tag that starts with that language code:

```javascript
const getTitle = (titleArray, lang = 'en') => {
  // prefer human-authored
  const human = titleArray.find((t) => t['@language'] === lang);
  if (human) return human['@value'];
  // fall back to MT
  const mt = titleArray.find((t) => t['@language'].startsWith(lang));
  return mt?.['@value'] ?? titleArray[0]?.['@value'] ?? null;
};
```

### `dct:description` - object vs array

When only one language is present, `dct:description` is a **single object** `{ "@language": "...", "@value": "..." }`. When multiple languages are present it becomes an **array** of those objects. Always handle both cases:

```javascript
const descriptions = [].concat(dataset['dct:description'] ?? []);
```

### `dcat:distribution` - references, not inline objects

`dcat:distribution` on the dataset node is an array of `{ "@id": "..." }` references, **not** the full distribution objects. The distributions themselves are separate nodes in `@graph`. Same applies to `dcat:contactPoint` and `dct:publisher`.

### Blank nodes (`_:...`)

Publisher and contact point nodes use **blank node identifiers** (`_:...`). These are local to this specific response - they have no meaning outside it and cannot be used as API identifiers in other calls.

### `dcat:accessURL` - object, not array

Unlike the Search API (where `access_url` is an array), in the Registry API `dcat:accessURL` is a **single `{ "@id": "..." }` object**. Be aware of this inconsistency when sharing parsing logic between the two APIs.

---

## References

- **Registry API (Swagger/OpenAPI):** [data.europa.eu/api/hub/repo/index.html](https://data.europa.eu/api/hub/repo/index.html)
- **EDP API documentation:** [dataeuropa.gitlab.io/data-provider-manual/api-documentation](https://dataeuropa.gitlab.io/data-provider-manual/api-documentation/)
- **DCAT-AP specification:** [joinup.ec.europa.eu - DCAT-AP](https://joinup.ec.europa.eu/collection/semantic-interoperability-community-semic/solution/dcat-application-profile-data-portals-europe)
- **JSON-LD specification:** [json-ld.org](https://json-ld.org/)
- **BCP 47 language tags:** [rfc-editor.org/rfc/bcp/bcp47.txt](https://www.rfc-editor.org/rfc/bcp/bcp47.txt)
- **EDP portal:** [data.europa.eu](https://data.europa.eu)

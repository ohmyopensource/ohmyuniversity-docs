---
title: EDP SPARQL API | OhMyUniversity!
description: REST API documentation for the European Data Portal SPARQL 1.1 endpoint - graph queries over the full RDF triple store.
head:
  - - meta
    - property: og:title
      content: EDP SPARQL API | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the European Data Portal SPARQL 1.1 endpoint - graph queries over the full RDF triple store.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/edp/api/sparql-api
  - - meta
    - name: keywords
      content: european data portal sparql, edp sparql endpoint, data.europa.eu sparql, rdf query open data, dcat-ap sparql, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: EDP SPARQL API | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the European Data Portal SPARQL 1.1 endpoint - graph queries over the full RDF triple store.
---

# OhMyUniversity! - European Data Portal: SPARQL API

**Endpoint:** `https://data.europa.eu/sparql`

The SPARQL API exposes a **SPARQL 1.1 query endpoint** over the full RDF triple store underlying the EDP. All metadata harvested from European open data portals is stored as DCAT-AP RDF triples and is queryable here. Unlike the Search API (keyword search) or the Registry API (single-record retrieval), SPARQL allows arbitrary graph traversal - joins across datasets, publishers, themes and distributions in a single query.

::: info When to use SPARQL vs the other APIs

- **Search API** > discover datasets by keyword or filter; best for interactive search
- **Registry API** > retrieve the complete DCAT-AP record of one known dataset
- **SPARQL API** > query relationships across datasets, aggregate counts, filter by multiple linked-data properties simultaneously
  :::

::: warning Read-only for anonymous users
Anonymous access only supports read queries (`SELECT`, `CONSTRUCT`, `DESCRIBE`, `ASK`). Update operations (`INSERT`, `DELETE`, `UPDATE`) require write credentials and are out of scope for OhMyUniversity!.
:::

---

## Available endpoints

| Endpoint                     | Description                     | Status    |
| ---------------------------- | ------------------------------- | --------- |
| [`GET /sparql`](#get-sparql) | Execute a SPARQL 1.1 read query | Available |

---

### `GET /sparql` - Execute a SPARQL query

```java
/**
 * Executes a SPARQL 1.1 read query against the EDP RDF triple store.
 * Supports SELECT, CONSTRUCT, DESCRIBE and ASK query forms.
 *
 * The response format depends on both the query form and the format
 * parameter. SELECT and ASK return SPARQL Results JSON by default.
 * CONSTRUCT and DESCRIBE return RDF serialisations.
 *
 * @param query  string (query, required) - URL-encoded SPARQL 1.1 query string
 * @param format string (query, optional) - requested response serialisation;
 *                                          defaults vary by query form;
 *                                          see accepted formats table below
 * @return SPARQL results in the requested format; structure depends on
 *         the query form (SELECT, ASK, CONSTRUCT, DESCRIBE)
 */
GET /sparql
```

**Auth:** None (read-only) · **Cache:** None

#### Accepted `format` values by query form

| Query form  | `format` value                                | Response Content-Type             | Response structure                          |
| ----------- | --------------------------------------------- | --------------------------------- | ------------------------------------------- |
| `SELECT`    | `application/sparql-results+json` _(default)_ | `application/sparql-results+json` | `{ head: { vars }, results: { bindings } }` |
| `SELECT`    | `application/sparql-results+xml`              | `application/sparql-results+xml`  | XML                                         |
| `SELECT`    | `text/csv`                                    | `text/csv`                        | CSV                                         |
| `SELECT`    | `text/tab-separated-values`                   | `text/tab-separated-values`       | TSV                                         |
| `ASK`       | `application/sparql-results+json` _(default)_ | `application/sparql-results+json` | `{ head: { link }, boolean: true\|false }`  |
| `ASK`       | `application/sparql-results+xml`              | `application/sparql-results+xml`  | XML                                         |
| `CONSTRUCT` | `text/turtle` _(default)_                     | `text/turtle`                     | Turtle RDF                                  |
| `CONSTRUCT` | `application/ld+json`                         | `application/ld+json`             | JSON-LD                                     |
| `CONSTRUCT` | `application/rdf+xml`                         | `application/rdf+xml`             | RDF/XML                                     |
| `DESCRIBE`  | `text/turtle` _(default)_                     | `text/turtle`                     | Turtle RDF                                  |
| `DESCRIBE`  | `application/ld+json`                         | `application/ld+json`             | JSON-LD                                     |

#### Example requests

SELECT - datasets with their titles, first 2 results:

```http
GET https://data.europa.eu/sparql?query=SELECT+%3Fs+%3Ftitle+WHERE+%7B+%3Fs+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E+.+%3Fs+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Ftitle%3E+%3Ftitle+.+%7D+LIMIT+2&format=application%2Fsparql-results%2Bjson
```

ASK - check if a dataset exists:

```http
GET https://data.europa.eu/sparql?query=ASK+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2F88u%2Fdataset%2Fmedarbejdere-ved-via-university-college%3E+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E+%7D&format=application%2Fsparql-results%2Bjson
```

---

#### Response - `SELECT` query

**`200 OK`**

```json
{
  "head": {
    "link": [], // always present; always empty array in practice
    "vars": [
      // variable names declared in the SELECT clause
      "s",
      "title"
    ]
  },
  "results": {
    "distinct": false, // true if DISTINCT keyword was used
    "ordered": true, // true if ORDER BY was used
    "bindings": [
      // one object per result row
      {
        "s": {
          "type": "uri", // "uri" | "literal" | "bnode"
          "value": "http://data.europa.eu/88u/dataset/0800af55-8e56-49a0-8986-aa55151d0440"
        },
        "title": {
          "type": "literal",
          "xml:lang": "de", // language tag; present only on language-tagged literals
          "value": "INSPIRE-Dienst für den Bebauungsplan XPlanung-Dienst..."
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://data.europa.eu/88u/dataset/0800af55-8e56-49a0-8986-aa55151d0440"
          // same dataset URI - appears again for the machine-translated title
        },
        "title": {
          "type": "literal",
          "xml:lang": "mt-t-de-t0-mtec", // BCP47 MT tag: Maltese translated from German
          "value": "Servizz INSPIRE għall-pjan ta' żvilupp..."
        }
      }
    ]
  }
}
```

#### Response - `ASK` query

**`200 OK`**

```json
{
  "head": {
    "link": [] // always present; always empty array
    // note: no "vars" key - ASK has no variable bindings
  },
  "boolean": true // true if the pattern matched, false otherwise
  // note: no "results" key - ASK response only has "head" and "boolean"
}
```

#### Response - `CONSTRUCT` / `DESCRIBE` query

Returns an RDF serialisation directly - **not JSON**. The exact format depends on the `format` parameter. Unlike `SELECT` and `ASK`, there is no wrapper object: the raw RDF graph is the entire response body.

::: warning Prefix names are auto-generated
The EDP SPARQL engine assigns prefixes automatically (`ns1`, `ns2`, `ns3`...). These are **not** the standard aliases (`dcat`, `dct`...). Always resolve them via the `@prefix` declarations at the top of the Turtle response - never hardcode prefix names.
:::

::: info Extra triples vs Registry API
`CONSTRUCT` returns triples directly from the RDF store, which includes **DQV quality measurement blank nodes** (`ns3:hasQualityMeasurement`) that are not present in the Registry API JSON-LD response. Publisher and contact point nodes appear as opaque blank node references (`_:vb...`) - their properties are not expanded inline.
:::

```turtle
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix ns1:     <http://data.europa.eu/88u/dataset/> .
@prefix ns2:     <http://www.w3.org/ns/dcat#> .           # = dcat
@prefix ns3:     <http://www.w3.org/ns/dqv#> .            # = dqv (Data Quality Vocabulary)
@prefix ns4:     <http://data.europa.eu/88u/distribution/> .
@prefix dcterms: <http://purl.org/dc/terms/> .            # = dct
@prefix ns6:     <http://publications.europa.eu/resource/authority/data-theme/> .
@prefix ns7:     <http://data.europa.eu/88u/metrics/> .

ns1:medarbejdere-ved-via-university-college
    rdf:type ns2:Dataset ;

    # ── DQV quality measurements (blank nodes - not expanded inline) ──────────
    ns3:hasQualityMeasurement
        _:vb3888458238 , _:vb3888458284 , _:vb3888458295 ,
        _:vb3888458298 , _:vb3888458302 , _:vb3888458303 ,
        _:vb3888458304 , _:vb3888458306 , _:vb3888458307 ,
        _:vb3888458244 , _:vb3888458311 , _:vb3888458314 ,
        _:vb3888458255 , _:vb3888458271 , _:vb3888458275 ,
        _:vb3888458279 ;
    # ^ 16 quality measurement nodes - one per MQA indicator
    # blank node IDs are session-scoped and change on each request

    # ── Distributions (URI references only - not expanded inline) ────────────
    ns2:distribution
        ns4:fb633dda-7f49-4904-b323-216f63b63d6c ,
        ns4:ea08268c-ef52-4ce9-82bf-e082a2df7a18 ,
        <http://data.europa.eu/88u/distribution/619066f0-d13a-4678-8180-c577711fae2d> ,
        <http://data.europa.eu/88u/distribution/3e0ac27e-a340-4ad9-b336-04bb4c6154ae> ;

    # ── Multilingual titles (25 entries: 1 original @da + 24 MT) ─────────────
    dcterms:title
        "Medarbejdere ved VIA University College"@da ,
        "Staff at VIA University College"@en-t-da-t0-mtec ,
        "Personale del VIA University College"@it-t-da-t0-mtec ,
        "Mitarbeiter am VIA University College"@de-t-da-t0-mtec
        # ... 21 more language entries
        # Unicode chars are escaped in raw Turtle: \u00F8 = ø, \u0141 = Ł etc.
    ;

    # ── Theme, keywords, description ─────────────────────────────────────────
    ns2:theme      ns6:undefined ;
    ns2:keyword    "Campus"@da , "Køn"@da , "Alder"@da ,
                   "VIA University College"@da , "Medarbejder"@da ;
    dcterms:description
        "Medarbejdere ved VIA University College fordelt på Campus..."@da ;

    # ── Publisher and contact point (blank nodes - not expanded) ─────────────
    dcterms:publisher  _:vb2817425575 ;
    ns2:contactPoint   _:vb2817425574 ;

    # ── MQA metadata reference ────────────────────────────────────────────────
    ns3:hasQualityMetadata ns7:medarbejdere-ved-via-university-college .
```

**`400 Bad Request`** - malformed SPARQL syntax:

```
// Plain text or HTML error message from the SPARQL engine
// No structured JSON error envelope
```

---

## Vocabulary prefixes

All DCAT-AP properties use these standard namespaces. Declare them in every query with `PREFIX`:

| Prefix  | Namespace URI                                 | Used for                                                   |
| ------- | --------------------------------------------- | ---------------------------------------------------------- |
| `dcat`  | `http://www.w3.org/ns/dcat#`                  | Dataset, Distribution, theme, keyword, contactPoint        |
| `dct`   | `http://purl.org/dc/terms/`                   | title, description, publisher, license, format, identifier |
| `foaf`  | `http://xmlns.com/foaf/0.1/`                  | Organization, name, homepage                               |
| `vcard` | `http://www.w3.org/2006/vcard/ns#`            | Kind, fn, hasEmail                                         |
| `skos`  | `http://www.w3.org/2004/02/skos/core#`        | prefLabel, broader (themes/categories)                     |
| `rdf`   | `http://www.w3.org/1999/02/22-rdf-syntax-ns#` | type                                                       |
| `xsd`   | `http://www.w3.org/2001/XMLSchema#`           | date, integer, boolean literals                            |

---

## Practical query examples

University datasets with EDUC theme, English titles only:

```sparql
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct:  <http://purl.org/dc/terms/>

SELECT ?dataset ?title WHERE {
  ?dataset a dcat:Dataset ;
           dct:title ?title ;
           dcat:theme <http://publications.europa.eu/resource/authority/data-theme/EDUC> .
  FILTER(lang(?title) = "en")
} LIMIT 20
```

Count datasets per theme, sorted by count:

```sparql
PREFIX dcat: <http://www.w3.org/ns/dcat#>

SELECT ?theme (COUNT(?dataset) AS ?count) WHERE {
  ?dataset a dcat:Dataset ;
           dcat:theme ?theme .
} GROUP BY ?theme ORDER BY DESC(?count) LIMIT 10
```

All distributions of a specific dataset:

```sparql
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct:  <http://purl.org/dc/terms/>

SELECT ?dist ?format ?url WHERE {
  <http://data.europa.eu/88u/dataset/medarbejdere-ved-via-university-college>
    dcat:distribution ?dist .
  ?dist dct:format ?format ;
        dcat:accessURL ?url .
}
```

Check if a dataset exists (ASK):

```sparql
ASK {
  <http://data.europa.eu/88u/dataset/medarbejdere-ved-via-university-college>
    a <http://www.w3.org/ns/dcat#Dataset> .
}
```

---

## Notes on query results

### Language tag filtering

DCAT-AP metadata uses two kinds of language tags (see also the Registry API notes):

- **Plain ISO 639-1 tags** (`da`, `en`, `it`) - original human-authored text
- **BCP47 MT extension tags** (`en-t-de-t0-mtec`) - machine-translated text, format `{target}-t-{source}-t0-mtec`

To get only human-authored text, exclude tags containing `-t-`:

```sparql
FILTER(!CONTAINS(lang(?title), "-t-"))
```

To get a specific language regardless of origin:

```sparql
FILTER(STRSTARTS(lang(?title), "en"))
```

### Multiple rows per dataset

When querying multilingual properties like `dct:title`, **each language tag produces a separate row**. A single dataset with 24 translated titles will return 24 bindings for that dataset URI. Always filter by language unless you explicitly need all translations.

### `?dataset` is the full RDF URI, not the slug

Queries return the canonical RDF URI (`http://data.europa.eu/88u/dataset/...`). To get the slug for use in the Search or Registry API:

```javascript
const slug = uri.split('/').pop();
// "medarbejdere-ved-via-university-college"
```

### ASK response has no `results` key

`ASK` queries return `{ head: { link: [] }, boolean: true|false }`. There is no `results` key. Do not attempt to access `response.results.bindings` on an ASK response.

### `LIMIT` is mandatory in practice

The EDP triple store contains millions of triples. Always include `LIMIT` (and `OFFSET` for pagination) - queries without a limit may time out or return excessively large payloads.

### Interactive UI

The SPARQL endpoint also offers a browser-based query interface directly at `https://data.europa.eu/sparql` - useful for testing queries before integrating them in code.

---

## References

- **SPARQL UI:** [data.europa.eu/sparql](https://data.europa.eu/sparql)
- **EDP API documentation:** [dataeuropa.gitlab.io/data-provider-manual/api-documentation](https://dataeuropa.gitlab.io/data-provider-manual/api-documentation/)
- **SPARQL 1.1 query specification:** [w3.org/TR/sparql11-query](https://www.w3.org/TR/sparql11-query/)
- **SPARQL 1.1 protocol:** [w3.org/TR/sparql11-protocol](https://www.w3.org/TR/sparql11-protocol/)
- **SPARQL 1.1 JSON results format:** [w3.org/TR/sparql11-results-json](https://www.w3.org/TR/sparql11-results-json/)
- **DCAT-AP specification:** [joinup.ec.europa.eu - DCAT-AP](https://joinup.ec.europa.eu/collection/semantic-interoperability-community-semic/solution/dcat-application-profile-data-portals-europe)
- **EU data theme vocabulary:** [publications.europa.eu/resource/authority/data-theme](http://publications.europa.eu/resource/authority/data-theme)
- **EDP portal:** [data.europa.eu](https://data.europa.eu)

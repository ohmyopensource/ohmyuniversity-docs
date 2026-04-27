---
title: European Data Portal API - Overview | OhMyUniversity!
description: Overview of the European Data Portal (EDP) APIs, including Search, Registry, SPARQL and MQA endpoints for accessing open European datasets.
head:
  - - meta
    - property: og:title
      content: European Data Portal API - Overview | OhMyUniversity!
  - - meta
    - property: og:description
      content: Overview of the European Data Portal (EDP) APIs, including Search, Registry, SPARQL and MQA endpoints for accessing open European datasets.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/edp/overview
  - - meta
    - name: keywords
      content: european data portal api, edp api, data.europa.eu api, search api, registry api, sparql api, open data europe, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: European Data Portal API - Overview | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Overview of the European Data Portal (EDP) APIs for accessing open European datasets relevant to university and education statistics.
---

# OhMyUniversity! - European Data Portal API

**Portal:** `data.europa.eu` · **Standard:** `DCAT-AP / RDF` · **API Paradigms:** `REST · SPARQL · OpenAPI`

The **European Data Portal (EDP)**, operated by the Publications Office of the European Union, is the single point of access to open data published by EU institutions, agencies, national and regional governments across Europe. Unlike the MUR USTAT portal - which is a single-source CKAN instance - the EDP is a **metadata catalogue aggregator**: it harvests and indexes dataset descriptions (metadata) from hundreds of national and European open data portals, pointing to the actual data hosted by the original publishers.

For OhMyUniversity!, the EDP is used primarily to discover and access **education and university statistics** at a European comparative level, complementing national data from MUR and MIM.

---

## Key distinction: metadata vs data

::: warning
The EDP APIs operate on **metadata** (descriptions of datasets), not on the datasets themselves. When you retrieve a dataset record, you get the title, description, publisher, keywords, and download URLs - not the raw statistical tables. To get the actual data, you follow the resource URLs returned in the metadata and download the files directly (CSV, JSON, XLSX, etc.) from the original publisher's server.
:::

The main exception is the **Eurostat Statistics API**, which is a separate, direct-data API (documented in its own section) and is accessible independently of the EDP portal.

---

## Data relevant to OhMyUniversity!

The EDP aggregates over 9,000 education-related datasets. The most relevant categories for a university application are:

| Category                        | Description                                       | Primary source |
| ------------------------------- | ------------------------------------------------- | -------------- |
| **Enrolled students**           | Students by ISCED level, country, age, gender     | Eurostat       |
| **Graduates**                   | Graduation rates and totals across EU             | Eurostat       |
| **Student mobility**            | Erasmus+ flows in/out per country                 | Eurostat / EC  |
| **HEI registry**                | Descriptive data on ~3,500 European universities  | ETER           |
| **University finances**         | Budget, revenues and expenditures per HEI         | ETER           |
| **Academic staff**              | Researchers and teaching staff per institution    | ETER           |
| **Employment after graduation** | Post-degree employment rates by field             | Eurostat       |
| **Educational attainment**      | % population with tertiary degree, by NUTS region | Eurostat       |

---

## API families

The EDP exposes **four distinct API systems**, each with a different paradigm and use case. They do not share a common base URL or request format.

| API              | Base URL                                 | Paradigm                      | Best for                                                     |
| ---------------- | ---------------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| **Search API**   | `https://data.europa.eu/api/hub/search/` | REST / JSON                   | Full-text search and filtering on datasets                   |
| **Registry API** | `https://data.europa.eu/api/hub/repo/`   | REST / RDF (JSON-LD, Turtle…) | Retrieving structured DCAT-AP metadata of a specific dataset |
| **SPARQL API**   | `https://data.europa.eu/sparql`          | SPARQL 1.1                    | Complex graph queries across the full RDF triple store       |
| **MQA API**      | `https://data.europa.eu/api/mqa/cache/`  | REST / JSON                   | Metadata quality scores and reports per dataset or catalogue |

---

## Endpoint categories

| Category                           | Description                                                  | File              |
| ---------------------------------- | ------------------------------------------------------------ | ----------------- |
| [Search API](./api/search-api)     | Full-text search, filtering and pagination over all datasets | `search-api.md`   |
| [Registry API](./api/registry-api) | Direct access to RDF/DCAT-AP metadata records                | `registry-api.md` |
| [SPARQL API](./api/sparql-api)     | SPARQL 1.1 query endpoint over the full RDF triple store     | `sparql-api.md`   |
| [MQA API](./api/mqa-api)           | Metadata quality assessment scores and reports               | `mqa-api.md`      |

---

## Authentication

All EDP APIs are **fully public** for read operations. No API key, token, or registration is required to search datasets, retrieve metadata, or run SPARQL queries.

Write access (creating or updating dataset records) requires OAuth2/OpenID Connect credentials and is only relevant for registered data providers - not for application consumers like OhMyUniversity!.

::: tip
For full details, see the [Auth](./auth) page.
:::

---

## Response formats

Different APIs return data in different formats:

| API          | Default format          | Alternatives                                         |
| ------------ | ----------------------- | ---------------------------------------------------- |
| Search API   | `JSON`                  | -                                                    |
| Registry API | `JSON-LD`               | Turtle (`.ttl`), N-Triples (`.nt`), RDF/XML (`.xml`) |
| SPARQL API   | `JSON` (SPARQL Results) | XML, CSV, TSV                                        |
| MQA API      | `JSON`                  | -                                                    |

To request a different serialisation on the Registry API, append the file extension to the resource URL:

```http
GET https://data.europa.eu/api/hub/repo/datasets/{id}.ttl
```

---

## Quick start examples

**Search datasets by keyword:**

```http
GET https://data.europa.eu/api/hub/search/search?q=university&limit=20&page=0
```

**List datasets with pagination:**

```http
GET https://data.europa.eu/api/hub/search/search?page=1&limit=10
```

**Get full metadata of a specific dataset (JSON-LD):**

```http
GET https://data.europa.eu/api/hub/repo/datasets/91f2aec3-1aaf-42d3-8730-c567a46c0116
```

**Run a SPARQL query to list datasets and titles:**

```sparql
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT ?s ?title WHERE {
  ?s a dcat:Dataset .
  ?s dct:title ?title .
} LIMIT 10
```

---

## Technical notes

- All Search and Registry API requests are **`GET`** only for public consumers. No `POST`, `PUT` or `DELETE` is available without write credentials.
- The `limit` and `page` parameters are available on all Search API endpoints.
- SPARQL queries are submitted as `GET` requests with the query URL-encoded in the `query` parameter, or via the interactive UI.
- The SPARQL endpoint only allows **read-only** queries for anonymous users.
- Dataset records use **DCAT-AP** vocabulary, based on W3C DCAT. Metadata fields follow RDF/Linked Data conventions.
- All metadata is available in **24 official EU languages** via machine translation (eTranslation).
- Some dataset records point to resources hosted externally (Eurostat, national portals, etc.); availability and format depend on the original publisher.

---

## References

- **EDP API Documentation:** [dataeuropa.gitlab.io/data-provider-manual/api-documentation](https://dataeuropa.gitlab.io/data-provider-manual/api-documentation/)
- **Search API (Swagger/OpenAPI):** [data.europa.eu/api/hub/search](https://data.europa.eu/api/hub/search/)
- **Registry API (Swagger/OpenAPI):** [data.europa.eu/api/hub/repo/index.html](https://data.europa.eu/api/hub/repo/index.html)
- **MQA API:** [data.europa.eu/api/mqa/cache/index.html](https://data.europa.eu/api/mqa/cache/index.html)
- **SPARQL UI:** [data.europa.eu/sparql](https://data.europa.eu/sparql)
- **DCAT-AP specification:** [joinup.ec.europa.eu/collection/semantic-interoperability-community-semic/solution/dcat-application-profile-data-portals-europe](https://joinup.ec.europa.eu/collection/semantic-interoperability-community-semic/solution/dcat-application-profile-data-portals-europe)
- **Data license:** varies per dataset - always check the `dct:license` field in the dataset metadata

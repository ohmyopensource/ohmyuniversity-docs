---
title: MUR USTAT API - Overview | OhMyUniversity!
description: Overview of the statistical data APIs from the Italian Ministry of University and Research (MUR), based on the CKAN API v3 standard.
head:
  - - meta
    - property: og:title
      content: MUR USTAT API - Overview | OhMyUniversity!
  - - meta
    - property: og:description
      content: Overview of the statistical data APIs from the Italian Ministry of University and Research (MUR), based on the CKAN API v3 standard.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/mur/overview
  - - meta
    - name: keywords
      content: mur api, ustat api, ckan api, ministero università ricerca, open data università, dati statistici università, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: MUR USTAT API - Overview | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Overview of the statistical data APIs from the Italian Ministry of University and Research (MUR), based on the CKAN API v3 standard.
---

# OhMyUniversity! - MUR USTAT API

**Version:** `3.0` · **Standard:** `CKAN API v3` · **Base URL:** `https://dati-ustat.mur.gov.it/api/3/action`

The **USTAT** portal (Statistical Office of the MUR - Ministero dell'Università e della Ricerca) exposes its open data through the standard **CKAN** API, the open-source platform used by the majority of European and Italian open data portals.

---

## What is CKAN API v3

CKAN exposes a single family of endpoints organized around the concept of **action**: every endpoint is a `GET` request to `/api/3/action/{action_name}`, with parameters passed as query strings.

All responses follow a uniform JSON envelope:

```json
{
  "success": true,
  "result": <payload>,
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=<action>"
}
```

On error:

```json
{
  "success": false,
  "error": {
    "__type": "Validation Error",
    "message": "..."
  }
}
```

---

## Authentication

The MUR USTAT portal APIs are **fully public** and require no authentication for reading data. No API key, token or credentials are needed for any of the endpoints documented in this section.

::: tip
For details on authentication (if ever needed for write or administrative operations), see the [Auth](./auth) page.
:::

---

## Data structure

The MUR USTAT portal organizes data according to the standard CKAN hierarchy:

| Level | CKAN entity             | Description                                                   |
| ----- | ----------------------- | ------------------------------------------------------------- |
| 1     | **Organization**        | Publishing entity (e.g. MUR - Servizio Statistico)            |
| 2     | **Group**               | Thematic grouping across datasets                             |
| 3     | **Dataset** (`package`) | Collection of data on a specific topic (e.g. _Immatricolati_) |
| 4     | **Resource**            | A single file or table inside a dataset (CSV, XLSX, PDF…)     |
| 5     | **Datastore**           | Queryable version of a CSV/tabular resource                   |

---

## Endpoint categories

| Category                                                    | Description                                     | File                             |
| ----------------------------------------------------------- | ----------------------------------------------- | -------------------------------- |
| [Dataset](./api/dataset-api-v3)                             | List, search and detail of datasets             | `dataset-api-v3.md`              |
| [Resources](./api/resources-api-v3)                         | Metadata and search on resources (files)        | `resources-api-v3.md`            |
| [Datastore](./api/datastore-api-v3)                         | Tabular and SQL queries on structured resources | `datastore-api-v3.md`            |
| [Taxonomy](./api/taxonomy-api-v3)                           | Tags and controlled vocabularies                | `taxonomy-api-v3.md`             |
| [Groups & Organizations](./api/groups-organizations-api-v3) | Organizational structure of the portal          | `groups-organizations-api-v3.md` |
| [Portal](./api/portal-api-v3)                               | Status, licenses, vocabularies and inline help  | `portal-api-v3.md`               |
| [Activity](./api/activity-api-v3)                           | Change log and revision history on datasets     | `activity-api-v3.md`             |

---

## Available datasets

At the time this documentation was generated (2026-04-25), the portal exposes **68 public datasets**, all under the **IODL 2.0** license (Italian Open Data License v2.0), published by MUR - Servizio Statistico.

Topics covered include, among others:

- Enrolled students (_Immatricolati_) and registered students (_Iscritti_)
- Graduates (_Laureati_)
- University staff - academic, research and administrative
- Student contribution fees and university financial aid
- AFAM data (Alta Formazione Artistica, Musicale e Coreutica)

---

## Technical notes

- All requests are **`GET`**. There are no `POST`, `PUT` or `DELETE` endpoints for public reading.
- The `limit` parameter is generally available on list endpoints, with a default that varies per action.
- The **Datastore** is only available for resources that have `datastore_active: true` in their metadata.
- The `datastore_search_sql` endpoint accepts arbitrary SQL queries: the table to query is the resource `id` (e.g. `SELECT * FROM "uuid-resource" LIMIT 10`).
- Some endpoints are **not working** on the MUR USTAT instance (e.g. `datastore_info`, `group_show`, `organization_list`, `organization_show`) - they are documented but marked.

---

## References

- **MUR USTAT portal:** [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it)
- **CKAN API v3 documentation:** [docs.ckan.org/en/latest/api/index.html](https://docs.ckan.org/en/latest/api/index.html)
- **Inline help (portal):** `GET /api/3/action/help_show?name={action_name}`
- **Data license:** [IODL 2.0](https://www.dati.gov.it/content/italian-open-data-license-v20)

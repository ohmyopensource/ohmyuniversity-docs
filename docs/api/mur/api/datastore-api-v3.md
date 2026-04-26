---
title: Datastore API V3 | OhMyUniversity!
description: REST API documentation for the Datastore endpoints of the MUR USTAT CKAN portal - tabular queries and SQL on structured resources.
head:
  - - meta
    - property: og:title
      content: Datastore API V3 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Datastore endpoints of the MUR USTAT CKAN portal - tabular queries and SQL on structured resources.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/mur/api/datastore-api-v3
  - - meta
    - name: keywords
      content: mur api datastore, ckan datastore search, datastore sql, ustat api, dati università mur, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: Datastore API V3 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Datastore endpoints of the MUR USTAT CKAN portal - tabular queries and SQL on structured resources.
---

# OhMyUniversity! - MUR USTAT: Datastore API V3

**Version:** `3.0` · **Standard:** `CKAN API v3` · **Base URL:** `https://dati-ustat.mur.gov.it/api/3/action`

The CKAN **Datastore** is a PostgreSQL layer that hosts tabular resources (mainly CSV files) uploaded to the portal, making them queryable via API without downloading the files. Only resources with `datastore_active: true` in their metadata are available.

---

## Available endpoints

| Action                                              | Description                                 | Status      |
| --------------------------------------------------- | ------------------------------------------- | ----------- |
| [`datastore_search`](#get-datastore_search)         | Filtered tabular query on a resource        | Available   |
| [`datastore_search_sql`](#get-datastore_search_sql) | Arbitrary SQL query on the datastore        | Available   |
| [`datastore_info`](#get-datastore_info)             | Schema and metadata of a datastore resource | Not working |

---

## How to find a `resource_id`

The `resource_id` is the `id` field of a resource. It can be obtained from:

1. `GET /package_show?id=<dataset-slug>` > `resources[]` array > `id` field
2. `GET /resource_search?query=format:CSV` > `id` field of each result
3. The example tables at the bottom of this page list the `resource_id` of queryable resources available on the MUR USTAT portal.

```
Prerequisite: a resource is queryable only if "datastore_active": true
```

---

### `GET /datastore_search` - Query a datastore resource

```java
/**
 * Queries a resource loaded into the CKAN datastore (PostgreSQL). Supports
 * exact-value filters, fulltext search, field selection, pagination and
 * sorting. Only resources with datastore_active=true are queryable.
 * Use the fields array in the response to discover available column names
 * and types before querying.
 *
 * @param resource_id   string (query, required)  - UUID of the resource in
 *                                                  the datastore
 * @param filters       object (query, optional)  - exact-match filters as
 *                                                  JSON; e.g. {"GENERE":"F"}
 * @param q             string (query, optional)  - fulltext search across all
 *                                                  fields; accepts a plain
 *                                                  string or a JSON object for
 *                                                  field-specific search
 * @param distinct      boolean (query, optional) - if true, return only
 *                                                  distinct rows
 * @param plain         boolean (query, optional) - if false, uses PostgreSQL
 *                                                  tsquery syntax for fulltext;
 *                                                  defaults to true
 * @param language      string (query, optional)  - language for fulltext
 *                                                  search; defaults to "english"
 * @param limit         integer (query, optional) - maximum number of rows
 *                                                  returned; defaults to 100
 * @param offset        integer (query, optional) - pagination offset;
 *                                                  defaults to 0
 * @param fields        string (query, optional)  - comma-separated list of
 *                                                  fields to include in the
 *                                                  response
 * @param sort          string (query, optional)  - sort order; e.g.
 *                                                  "ANNO asc" or "ANNO desc"
 * @param include_total boolean (query, optional) - if false, omits total row
 *                                                  count; defaults to true
 * @return DatastoreSearchResult object containing fields schema, records,
 *         total count and pagination links on success, CKANError on failure
 */
GET /datastore_search
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": {
    "resource_id": "c39e6e60-d92e-46f2-bfaa-f865d3fb1771", // queried resource UUID
    "include_total": true, // mirrors the request parameter
    "records_format": "objects", // always "objects" for this endpoint
    "fields": [
      { "id": "_id", "type": "int" }, // internal row ID (auto-increment)
      { "id": "AnnoA", "type": "text" }, // column name and PostgreSQL type
      { "id": "Imm_M", "type": "numeric" },
      { "id": "Imm_F", "type": "numeric" },
      { "id": "Imm", "type": "numeric" },
      { "id": "fonte dati", "type": "text" },
      { "id": "note", "type": "text" }
    ],
    "records": [
      {
        "_id": 1, // internal row ID
        "AnnoA": "2024/2025", // academic year
        "Imm_M": 159917, // male enrolled students
        "Imm_F": 200694, // female enrolled students
        "Imm": 360611, // total enrolled students
        "fonte dati": "Anagrafe Nazionale degli Studenti universitari (ANS) - ottobre 2025",
        "note": ""
      }
    ],
    "_links": {
      "start": "/api/3/action/datastore_search?resource_id=c39e6e60-...", // first page URL
      "next": "/api/3/action/datastore_search?resource_id=c39e6e60-...&offset=100" // next page URL
    },
    "total": 52 // total number of rows in the resource
  },
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=datastore_search"
}
```

**`404 Not Found`** - Resource not found or `datastore_active` is false.

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

### `GET /datastore_search_sql` - SQL query on the datastore

```java
/**
 * Executes an arbitrary PostgreSQL SELECT query on the datastore. Tables
 * are identified by the resource UUID enclosed in double quotes. Only SELECT
 * statements are allowed - no INSERT, UPDATE, DELETE or DDL.
 * Field names with spaces or special characters must also be wrapped in
 * double quotes. SELECT * works but includes the internal _full_text column
 * - filter it out if not needed.
 *
 * @param sql string (query, required) - PostgreSQL SELECT statement; the
 *                                       table must be referenced as
 *                                       "<resource-uuid>" in double quotes;
 *                                       e.g. SELECT * FROM "abc-123" LIMIT 10
 * @return DatastoreSearchResult object containing fields schema and records
 *         on success, CKANError on failure
 */
GET /datastore_search_sql
```

**Auth:** None · **Cache:** None

> Not all CKAN installations enable this endpoint. It is active on the MUR USTAT instance.

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": {
    "records": [
      {
        "_id": 1, // internal row ID
        "ANNO": "1997", // year
        "GENERE": "F", // gender: M | F
        "COD_QUALIFICA": "1PO", // qualification code
        "DESC_QUALIFICA": "Professore I fascia (ordinario)", // qualification description
        "N_PERS_DR": 276 // headcount (with doctorate)
      }
    ],
    "fields": [
      { "id": "_id", "type": "int" },
      { "id": "ANNO", "type": "text" },
      { "id": "GENERE", "type": "text" },
      { "id": "COD_QUALIFICA", "type": "text" },
      { "id": "DESC_QUALIFICA", "type": "text" },
      { "id": "N_PERS_DR", "type": "numeric" }
    ]
  },
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=datastore_search_sql"
}
```

**`400 Bad Request`** - SQL syntax error or forbidden statement type.

```json
{
  "success": false,
  "error": {
    "__type": "Validation Error",
    "message": "SQL query is not allowed: ..."
  }
}
```

<br>

---

<br>

### `GET /datastore_info` - Get datastore resource schema

```java
/**
 * Returns the schema of a datastore resource: list of fields with their
 * PostgreSQL type, constraints and additional metadata.
 *
 * @param id string (query, required) - resource UUID
 * @return DatastoreInfo object containing schema and metadata on success,
 *         CKANError on failure
 */
GET /datastore_info
```

**Auth:** None · **Cache:** None

::: tip
**Not working on the MUR USTAT instance.** Returns an internal error (`'str' object has no attribute 'get'`) on any resource. Use the `fields` array in [`datastore_search`](#get-datastore_search---query-a-datastore-resource) response to retrieve schema information instead.
:::

---

## Available tabular resources (sample)

Below is a sample of the queryable resources available on the portal as of 2026-04-25. For the full list, use `resource_search?query=format:CSV` and filter by `datastore_active: true`.

### Dataset: Immatricolati

| Resource                                  | Resource ID                            | Rows |
| ----------------------------------------- | -------------------------------------- | ---- |
| Enrolled students totals by academic year | `c39e6e60-d92e-46f2-bfaa-f865d3fb1771` | 52   |

**Field schema:**

| Field        | Type      | Example                                                               |
| ------------ | --------- | --------------------------------------------------------------------- |
| `AnnoA`      | `text`    | `2024/2025`                                                           |
| `Imm_M`      | `numeric` | `159917`                                                              |
| `Imm_F`      | `numeric` | `200694`                                                              |
| `Imm`        | `numeric` | `360611`                                                              |
| `fonte dati` | `text`    | `Anagrafe Nazionale degli Studenti universitari (ANS) - ottobre 2025` |

---

### Dataset: 1997-2001 Personale universitario

| Resource                    | Resource ID                            | Rows |
| --------------------------- | -------------------------------------- | ---- |
| Staff by gender (1997–2001) | `ebfdf853-2fe0-40a9-a488-ed5df89234a4` | 2746 |

**Field schema:**

| Field            | Type      | Example                           |
| ---------------- | --------- | --------------------------------- |
| `ANNO`           | `text`    | `1997`                            |
| `GENERE`         | `text`    | `F`                               |
| `COD_QUALIFICA`  | `text`    | `1PO`                             |
| `DESC_QUALIFICA` | `text`    | `Professore I fascia (ordinario)` |
| `NOME_ATENEO`    | `text`    | `Torino - Università degli studi` |
| `Reg_ATENEO`     | `text`    | `Piemonte`                        |
| `AREA_GEO`       | `text`    | `NORD-OVEST`                      |
| `N_PERS`         | `numeric` | `276`                             |

---

### Dataset: Serie storica sul personale universitario

| Resource                                             | Resource ID                            | Rows  |
| ---------------------------------------------------- | -------------------------------------- | ----- |
| Academic staff by gender and qualification           | `85c1ab95-c8db-484b-8898-56478c521721` | 298   |
| Academic staff by age class and qualification        | `a9cc23fc-785a-4969-af49-5e9378be582b` | 1073  |
| Academic staff by gender and scientific area         | `3bdba958-5c6c-4b4e-a830-70e30014ee94` | 4214  |
| Academic staff by age class and scientific area      | `9a00b718-747f-49ec-a053-50a7e2c65c47` | 12868 |
| Language collaborators (_Collaboratori linguistici_) | `034ec5fd-8478-43e5-aa12-e3e23e6f882d` | 100   |
| Technical and administrative staff                   | `12ce67fe-5540-402f-9a00-82a8b61fd601` | 644   |

---

## References

- **Inline help:** `GET /api/3/action/help_show?name=datastore_search`
- **CKAN Datastore API documentation:** [docs.ckan.org - DataStore API](https://docs.ckan.org/en/latest/maintaining/datastore.html)
- **MUR USTAT portal:** [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it)

---
title: Activity API V3 | OhMyUniversity!
description: REST API documentation for the Activity endpoints of the MUR USTAT CKAN portal - activity log and revision history on datasets.
head:
  - - meta
    - property: og:title
      content: Activity API V3 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Activity endpoints of the MUR USTAT CKAN portal - activity log and revision history on datasets.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/mur/api/activity-api-v3
  - - meta
    - name: keywords
      content: mur api attività, ckan activity list, package activity, recently changed packages, ustat api, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: Activity API V3 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Activity endpoints of the MUR USTAT CKAN portal - activity log and revision history on datasets.
---

# OhMyUniversity! - MUR USTAT: Activity API V3

**Version:** `3.0` · **Standard:** `CKAN API v3` · **Base URL:** `https://dati-ustat.mur.gov.it/api/3/action`

Endpoints for monitoring **dataset changes**: who modified what and when. Useful for tracking updates to the statistical data published by the MUR.

---

## Available endpoints

| Action                                                                                    | Description                                     | Status    |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------- | --------- |
| [`recently_changed_packages_activity_list`](#get-recently_changed_packages_activity_list) | Latest changes across any dataset on the portal | Available |
| [`package_activity_list`](#get-package_activity_list)                                     | Full change history for a specific dataset      | Available |

---

## Activity record structure

Every activity record shares this common structure:

| Field           | Type     | Description                                                      |
| --------------- | -------- | ---------------------------------------------------------------- |
| `id`            | `string` | Unique activity UUID                                             |
| `timestamp`     | `string` | ISO 8601 date and time of the event                              |
| `user_id`       | `string` | UUID of the user who performed the action                        |
| `object_id`     | `string` | UUID of the modified dataset                                     |
| `revision_id`   | `string` | UUID of the associated revision                                  |
| `activity_type` | `string` | Action type: `new package`, `changed package`, `deleted package` |
| `data.package`  | `object` | Snapshot of the dataset metadata at the time of the action       |

---

### `GET /recently_changed_packages_activity_list` - List recent dataset activity

```java
/**
 * Returns the most recent changes to any dataset on the portal, ordered by
 * timestamp descending. Each record contains a snapshot of the dataset
 * metadata at the time of the event. Useful for polling-based update
 * detection or building change feeds.
 *
 * @param limit  integer (query, optional) - maximum number of activity
 *                                           records to return; defaults to 31
 * @param offset integer (query, optional) - pagination offset; defaults to 0
 * @return List<ActivityRecord> list of activity records on success,
 *         CKANError on failure
 */
GET /recently_changed_packages_activity_list
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": [
    {
      "id": "act-uuid-001", // activity UUID
      "timestamp": "2026-03-23T14:48:46.455964", // ISO 8601 event timestamp
      "user_id": "ade42fed-b188-4f01-b9f3-b4f1296fea76", // UUID of the user who made the change
      "object_id": "b47de019-4086-4b19-bb6b-4d8bc622b195", // UUID of the modified dataset
      "revision_id": "d245e365-5644-4aba-bc3f-56d18aedbd30", // UUID of the revision
      "activity_type": "changed package", // event type: new package | changed package | deleted package
      "data": {
        "package": {
          "id": "b47de019-4086-4b19-bb6b-4d8bc622b195", // dataset UUID
          "name": "2024-contribuzione-e-interventi-atenei", // dataset slug
          "title": "2024 Contribuzione e Interventi atenei", // dataset title
          "maintainer": "MUR - Servizio Statistico",
          "maintainer_email": "ufficio.statistico@mur.gov.it",
          "author": "MUR - Servizio Statistico",
          "author_email": "ufficio.statistico@mur.gov.it",
          "state": "active", // dataset state at time of event
          "private": false,
          "license_id": "IODL-2.0",
          "metadata_modified": "2026-03-23T14:48:43.192183", // ISO 8601 modification timestamp
          "notes": "Dati relativi a: gettito della contribuzione studentesca...", // dataset description
          "owner_org": "ace58834-5a0b-40f6-9b0e-ed6c34ea8de0", // organization UUID
          "type": "dataset"
        }
      }
    }
  ],
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=recently_changed_packages_activity_list"
}
```

**`400 Bad Request`** - Invalid parameters.

```json
{
  "success": false,
  "error": {
    "__type": "Validation Error",
    "message": "..."
  }
}
```

<br>

---

<br>

### `GET /package_activity_list` - Get dataset change history

```java
/**
 * Returns all activity records for a specific dataset, ordered by timestamp
 * descending. Covers the full lifecycle of the dataset: creation, all
 * updates and deletion (if applicable). Each record contains a snapshot of
 * the dataset metadata at the time of the event.
 *
 * @param id     string (query, required)  - dataset slug or UUID
 * @param limit  integer (query, optional) - maximum number of activity
 *                                           records to return; defaults to 31
 * @param offset integer (query, optional) - pagination offset; defaults to 0
 * @return List<ActivityRecord> list of activity records on success,
 *         CKANError on failure
 */
GET /package_activity_list
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": [
    {
      "id": "act-uuid-002", // activity UUID
      "timestamp": "2018-09-21T12:36:22.408921", // ISO 8601 event timestamp
      "user_id": "ca3830e9-7562-4988-b031-83fd195a16a5", // UUID of the user who made the change
      "object_id": "94364467-8ac0-436c-bb36-a5f037a45d5a", // UUID of the dataset
      "revision_id": "e747482a-c00e-48d6-b894-54f580faa26c", // UUID of the revision
      "activity_type": "changed package", // event type: new package | changed package | deleted package
      "data": {
        "package": {
          "id": "94364467-8ac0-436c-bb36-a5f037a45d5a", // dataset UUID
          "name": "1997-2001-personale-universitario", // dataset slug
          "title": "1997-2001 Personale universitario", // dataset title
          "maintainer": "MIUR - Gestione Patrimonio Informativo e Statistica", // maintainer at time of event
          "maintainer_email": "ufficio.statistico@miur.it",
          "state": "active", // dataset state at time of event
          "license_id": "IODL-2.0",
          "metadata_modified": "2018-09-21T13:36:21.943335",
          "notes": "Dati sul personale universitario relativi agli anni dal 1997 al 2001",
          "owner_org": "ace58834-5a0b-40f6-9b0e-ed6c34ea8de0",
          "type": "dataset"
        }
      }
    }
  ],
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=package_activity_list"
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

---

## References

- **Inline help:** `GET /api/3/action/help_show?name=recently_changed_packages_activity_list`
- **CKAN Activity Streams documentation:** [docs.ckan.org - Activity stream API](https://docs.ckan.org/en/latest/api/index.html)
- **MUR USTAT portal:** [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it)

---
title: Groups & Organizations API V3 | OhMyUniversity!
description: REST API documentation for the Groups and Organizations endpoints of the MUR USTAT CKAN portal - thematic groups and publishing entities.
head:
  - - meta
    - property: og:title
      content: Groups & Organizations API V3 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Groups and Organizations endpoints of the MUR USTAT CKAN portal - thematic groups and publishing entities.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/mur/api/groups-organizations-api-v3
  - - meta
    - name: keywords
      content: mur api gruppi, ckan group list, organization list, ustat api, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: Groups & Organizations API V3 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Groups and Organizations endpoints of the MUR USTAT CKAN portal - thematic groups and publishing entities.
---

# OhMyUniversity! - MUR USTAT: Groups & Organizations API V3

**Version:** `3.0` · **Standard:** `CKAN API v3` · **Base URL:** `https://dati-ustat.mur.gov.it/api/3/action`

Endpoints for navigating the portal's organizational structure. In CKAN, **groups** are thematic groupings that cut across datasets, while **organizations** are the publishing entities that own datasets.

::: warning
Most of these endpoints are **not working** on the MUR USTAT instance. Only `group_list` returns a response (an empty list). The remaining endpoints are documented for completeness but do not produce useful data.
:::

---

## Available endpoints

| Action                                        | Description                     | Status                     |
| --------------------------------------------- | ------------------------------- | -------------------------- |
| [`group_list`](#get-group_list)               | List thematic groups            | Available (empty response) |
| [`group_show`](#get-group_show)               | Detail of a single group        | Not working                |
| [`organization_list`](#get-organization_list) | List organizations              | Not working                |
| [`organization_show`](#get-organization_show) | Detail of a single organization | Not working                |

---

### `GET /group_list` - List thematic groups

```java
/**
 * Returns the thematic groups of the portal. On the MUR USTAT instance the
 * response is always an empty list - datasets use the theme field (EuroVoc)
 * for thematic classification instead of CKAN groups.
 *
 * @param all_fields            boolean (query, optional) - if true, returns
 *                                                          full group objects
 *                                                          instead of name
 *                                                          strings; defaults
 *                                                          to false
 * @param include_extras        boolean (query, optional) - include extra fields
 *                                                          for each group
 * @param include_tags          boolean (query, optional) - include tags
 *                                                          associated with
 *                                                          each group
 * @param include_groups        boolean (query, optional) - include sub-groups
 * @param include_dataset_count boolean (query, optional) - include dataset
 *                                                          count per group
 * @return List<string> list of group names when all_fields=false,
 *         List<Group> list of group objects when all_fields=true,
 *         CKANError on failure
 */
GET /group_list
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": [], // always empty on MUR USTAT - groups are not used on this portal
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=group_list"
}
```

 <br>

---

<br>

### `GET /group_show` - Get group detail

```java
/**
 * Returns the metadata of a group and the datasets it contains.
 *
 * @param id               string (query, required)  - group name or UUID
 * @param include_datasets boolean (query, optional) - if true, includes
 *                                                     datasets belonging to
 *                                                     the group; defaults to
 *                                                     false
 * @param include_extras   boolean (query, optional) - include extra fields
 * @return Group group detail object on success,
 *         CKANError on failure
 */
GET /group_show
```

**Auth:** None · **Cache:** None

::: warning
**Not working on the MUR USTAT instance.** Returns a validation error even when `id` is provided.
:::

#### Response

**`400 Bad Request`** - Validation error (returned even with a valid `id`).

```json
{
  "success": false,
  "error": {
    "__type": "Validation Error",
    "id": ["Valore mancante"] // Italian error from the portal - "Missing value"
  }
}
```

 <br>

---

<br>

### `GET /organization_list` - List organizations

```java
/**
 * Returns the organizations that publish data on the portal.
 *
 * @param all_fields            boolean (query, optional) - if true, returns
 *                                                          full organization
 *                                                          objects instead of
 *                                                          name strings;
 *                                                          defaults to false
 * @param include_extras        boolean (query, optional) - include extra fields
 * @param include_dataset_count boolean (query, optional) - include dataset
 *                                                          count per
 *                                                          organization
 * @return List<string> list of organization names when all_fields=false,
 *         List<Organization> list of organization objects when all_fields=true,
 *         CKANError on failure
 */
GET /organization_list
```

**Auth:** None · **Cache:** None

::: warning
**Not working on the MUR USTAT instance.** Returns a JSON parse error.
:::

#### Response

**`500 Internal Server Error`** - JSON parse error from the portal.

```json
{
  "success": false,
  "error": {
    "__type": "Internal Server Error",
    "message": "Expecting value: line 1 column 1 (char 0)"
  }
}
```

<br>

---

<br>

### `GET /organization_show` - Get organization detail

```java
/**
 * Returns the metadata of an organization and its datasets.
 *
 * @param id               string (query, required)  - organization name or UUID
 * @param include_datasets boolean (query, optional) - if true, includes
 *                                                     datasets belonging to
 *                                                     the organization;
 *                                                     defaults to false
 * @return Organization organization detail object on success,
 *         CKANError on failure
 */
GET /organization_show
```

**Auth:** None · **Cache:** None

::: warning
**Not working on the MUR USTAT instance.** Returns a validation error even when `id` is provided.
:::

#### Response

**`400 Bad Request`** - Validation error (returned even with a valid `id`).

```json
{
  "success": false,
  "error": {
    "__type": "Validation Error",
    "id": ["Valore mancante"] // Italian error from the portal - "Missing value"
  }
}
```

---

## Note: MUR USTAT organization

From dataset metadata (the `owner_org` field), the main organization on the portal has UUID `ace58834-5a0b-40f6-9b0e-ed6c34ea8de0`. The publisher name in all datasets is `MUR - Servizio Statistico` with email `ufficio.statistico@mur.gov.it`.

---

## References

- **Inline help:** `GET /api/3/action/help_show?name=group_list`
- **CKAN Organization API documentation:** [docs.ckan.org - Organization API](https://docs.ckan.org/en/latest/api/index.html)
- **MUR USTAT portal:** [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it)

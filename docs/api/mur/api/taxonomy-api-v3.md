---
title: Taxonomy API V3 | OhMyUniversity!
description: REST API documentation for the Taxonomy endpoints of the MUR USTAT CKAN portal - tags and controlled vocabularies.
head:
  - - meta
    - property: og:title
      content: Taxonomy API V3 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Taxonomy endpoints of the MUR USTAT CKAN portal - tags and controlled vocabularies.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/mur/api/taxonomy-api-v3
  - - meta
    - name: keywords
      content: mur api tag, ckan tag list, tag show, vocabulary list, ustat api, ohmyuniversity api
  - - meta
    - name: twitter:title
      content: Taxonomy API V3 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Taxonomy endpoints of the MUR USTAT CKAN portal - tags and controlled vocabularies.
---

# OhMyUniversity! - MUR USTAT: Taxonomy API V3

**Version:** `3.0` · **Standard:** `CKAN API v3` · **Base URL:** `https://dati-ustat.mur.gov.it/api/3/action`

Endpoints for managing the portal's **taxonomy**: free tags associated with datasets and controlled vocabularies (closed lists of terms, e.g. languages or EU themes).

---

## Available endpoints

| Action                      | Description            | Status    |
| --------------------------- | ---------------------- | --------- |
| [`tag_list`](#get-tag_list) | List all tags          | Available |
| [`tag_show`](#get-tag_show) | Detail of a single tag | Available |

---

### `GET /tag_list` - List all tags

```java
/**
 * Returns all tags used in the portal's datasets. With all_fields=true,
 * includes the UUID and vocabulary of each tag. Use vocabulary_id to
 * restrict results to a specific controlled vocabulary (e.g. "languages").
 *
 * @param vocabulary_id string (query, optional)  - filter by controlled
 *                                                  vocabulary name or UUID;
 *                                                  if omitted, returns all
 *                                                  free tags
 * @param all_fields    boolean (query, optional) - if true, returns full tag
 *                                                  objects instead of name
 *                                                  strings only; defaults to
 *                                                  false
 * @return List<string> list of tag names when all_fields=false,
 *         List<Tag> list of tag objects when all_fields=true,
 *         CKANError on failure
 */
GET /tag_list
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`** - `all_fields=false` (default)

```json
{
  "success": true,
  "result": [
    "Accademia", // tag name (Italian, as published by MUR)
    "Accademia Nazionale di Arte Drammatica",
    "Accademia Nazionale di Danza",
    "Accademie",
    "Alta Formazione Artistica e Musicale",
    "Dottori di ricerca",
    "Immatricolati",
    "Iscritti",
    "Laureati",
    "Personale universitario"
  ],
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=tag_list"
}
```

**`200 OK`** - `all_fields=true`

```json
{
  "success": true,
  "result": [
    {
      "id": "733c17be-aac6-4b87-a4eb-ff8542ca9cdb", // tag UUID
      "name": "Accademia", // tag name
      "display_name": "Accademia", // display name (may differ for vocabulary tags)
      "vocabulary_id": null // null for free tags; UUID for vocabulary tags
    }
  ],
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=tag_list"
}
```

<br>

---

<br>

### `GET /tag_show` - Get tag detail

```java
/**
 * Returns the detail of a single tag: UUID, name and vocabulary. With
 * include_datasets=true, also includes the list of datasets that use
 * the tag.
 *
 * @param id              string (query, required)  - tag name or UUID
 * @param vocabulary_id   string (query, optional)  - controlled vocabulary
 *                                                    name or UUID; useful
 *                                                    when the same name
 *                                                    exists in multiple
 *                                                    vocabularies
 * @param include_datasets boolean (query, optional) - if true, includes the
 *                                                     list of datasets using
 *                                                     this tag; defaults to
 *                                                     false
 * @return Tag tag detail object on success,
 *         CKANError on failure
 */
GET /tag_show
```

**Auth:** None · **Cache:** None

#### Response

**`200 OK`**

```json
{
  "success": true,
  "result": {
    "id": "733c17be-aac6-4b87-a4eb-ff8542ca9cdb", // tag UUID
    "name": "Immatricolati", // tag name
    "display_name": "Immatricolati", // display name
    "vocabulary_id": null, // null for free tags; UUID for vocabulary tags
    "packages": [
      // only present when include_datasets=true
      {
        "id": "14aeb712-4665-4311-9e90-3e13639e8f50", // dataset UUID
        "name": "immatricolati", // dataset slug
        "title": "Immatricolati (nuovi ingressi) e Iscritti al 1° anno", // dataset title
        "state": "active" // dataset state: active | deleted
      }
    ]
  },
  "help": "https://dati-ustat.mur.gov.it/api/3/action/help_show?name=tag_show"
}
```

**`404 Not Found`** - Tag not found.

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

## Controlled vocabularies

The MUR USTAT portal uses controlled vocabularies to standardize certain metadata fields. The available vocabularies can be retrieved via [`vocabulary_list`](./portal-api-v3#get-vocabulary_list) (documented in the Portal section).

At the time this documentation was generated, the vocabularies present are:

| Vocabulary  | ID                                     | Example terms                     |
| ----------- | -------------------------------------- | --------------------------------- |
| `languages` | `49716917-c59a-4be1-91a4-da5214d78d81` | `DEU`, `ENG`, `FRA`, `ITA`, `SPA` |
| `eu_themes` | _(see vocabulary_list)_                | `EDUC`, `GOVE`, `SOCI`…           |

> To query tags from a specific vocabulary: `tag_list?vocabulary_id=languages`

---

## References

- **Inline help:** `GET /api/3/action/help_show?name=tag_list`
- **CKAN Tag API documentation:** [docs.ckan.org - Tag API](https://docs.ckan.org/en/latest/api/index.html)
- **MUR USTAT portal:** [dati-ustat.mur.gov.it](https://dati-ustat.mur.gov.it)

---
title: Struttura API V1 | OhMyUniversity!
description: REST API documentation for the Struttura service (struttura-service-v1) - access to teaching structures, degree courses, study plans, and academic activities in CINECA ESSE3.
head:
  - - meta
    - property: og:title
      content: Struttura API V1 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Struttura service (struttura-service-v1) - access to teaching structures, degree courses, study plans, and academic activities in CINECA ESSE3.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/cineca/api-unimol/struttura-api-v1
  - - meta
    - name: keywords
      content: struttura api, teaching structure api, esse3 rest api, cineca api, ohmyuniversity api, corsi di studio, facolta, dipartimento, attivita didattiche, percorsi di studio
  - - meta
    - name: twitter:title
      content: Struttura API V1 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Struttura service (struttura-service-v1) - access to teaching structures, degree courses, study plans, and academic activities in CINECA ESSE3.
---

# OhMyUniversity! - Unimol: Struttura API V1

**ENG:** `Teaching Structure`

**Version:** `1.0.0` · **Base URL:** `/struttura-service-v1`

REST API for accessing the teaching structure in ESSE3, including disciplinary areas, degree courses, teaching structures (faculties and departments), study plans, academic activities, and related configuration data.

---

## Changelog

| Version | ESSE3 Release | Changes                                           |
| ------- | ------------- | ------------------------------------------------- |
| 1.1.0   | 19.04.02.00   | Added optional field `struttureCorso` to `/corsi` |

---

## Endpoints - Structure (Struttura)

### `GET /areeDisc` - Get disciplinary areas

```java
/**
 * Returns the list of disciplinary areas, optionally filtered by description.
 *
 * @param areaDiscDes string (query, optional) - disciplinary area description;
 *                                               supports wildcard * for LIKE search
 * @param order       string (query, optional) - sort order; prefix + (ASC) or -
 *                                               (DESC) followed by field name;
 *                                               multiple fields comma-separated
 *                                               (e.g. +areaDiscCod,-areaDiscDes)
 * @return List<AreaDisciplinare> list of disciplinary areas,
 *         or an empty array if none match
 */
GET /areeDisc
```

**Auth:** public - no authentication required

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "areaDiscCod": "AREA_1", // Disciplinary area code (primary key)
    "areaDiscDes": "string", // Disciplinary area description (Italian)
    "areaDiscDesEng": "string", // Disciplinary area description (English)
    "ateneoId": 1 // Institution ID
  }
]
```

<br>

---

<br>

### `GET /areeDisc/{areaDiscCod}` - Get disciplinary area by code

```java
/**
 * Returns a specific disciplinary area identified by its code.
 *
 * @param areaDiscCod string (path, required) - disciplinary area code
 * @return AreaDisciplinare the disciplinary area, or 404 if not found
 */
GET /areeDisc/{areaDiscCod}
```

**Auth:** public - no authentication required

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
{
  "areaDiscCod": "AREA_1", // Disciplinary area code (primary key)
  "areaDiscDes": "string", // Disciplinary area description (Italian)
  "areaDiscDesEng": "string", // Disciplinary area description (English)
  "ateneoId": 1 // Institution ID
}
```

<br>

---

<br>

---

## References

- **Swagger UI:** [Struttura Api V1 - ESSE3 REST Docs](<https://unimol.esse3.cineca.it/e3rest/docs/?urls.primaryName=Struttura%20Api%20V1%20(https%3A%2F%2Funimol.esse3.cineca.it%2Fe3rest%2Fapi%2Fstruttura-service-v1)#/>)
- **Spec YAML:** [p06-strutturaApiV1.yaml](https://unimol.esse3.cineca.it/e3rest/api/swagger-service-v1/swagger/specs/p06-strutturaApiV1.yaml)
- **ESSE3 REST API General Documentation:** [wiki.u-gov.it](https://wiki.u-gov.it/confluence/display/ESSE3/Servizi+REST+su+ESSE3)

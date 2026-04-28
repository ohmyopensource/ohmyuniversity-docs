---
title: Badge API V1 | OhMyUniversity!
description: REST API documentation for the Badge service (badge-service-v1) - access to badge data in CINECA ESSE3.
head:
  - - meta
    - property: og:title
      content: Badge API V1 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Badge service (badge-service-v1) - access to badge data in CINECA ESSE3.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/cineca/api-unimol/badge-api-v1
  - - meta
    - name: keywords
      content: badge api, esse3 rest api, cineca api, ohmyuniversity api, student badge, badge service
  - - meta
    - name: twitter:title
      content: Badge API V1 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Badge service (badge-service-v1) - access to badge data in CINECA ESSE3.
---

# OhMyUniversity! - Unimol: Badge API V1

**ENG:** `Badge`

**Version:** `1.1.0` · **Base URL:** `/badge-service-v1`

REST API for accessing badge-related data in ESSE3, including badge retrieval and import operations.

---

## Endpoints - Badge (Badge)

### `GET /badges` - Get badge data

```java
/**
 * Returns the list of badge records filtered by the provided parameters.
 * When called with STUDENTE auth, results are automatically scoped to
 * badges linked to the authenticated student.
 * Supports RSQL filtering applied after data retrieval.
 *
 * @param rfid       string (query, optional) - RFID code associated with the badge
 * @param stuId      long (query, optional)   - career ID filter
 * @param codFis     string (query, optional) - tax code filter
 * @param cdsCod     string (query, optional) - degree course code filter
 * @param aaIscrAnn  int (query, optional)    - enrollment year filter
 * @param staStuCod  string (query, optional) - student status filter;
 *                                              A=active, S=suspended,
 *                                              X=terminated, I=inactive
 * @param staMatCod  string (query, optional) - registration status filter;
 *                                              A=active, S=suspended, I=inactive
 * @param fields     string (query, optional) - optional fields to include;
 *                                              use ALL for all; supports
 *                                              Ant Glob Patterns
 * @param order      string (query, optional) - sort order; prefix field with +
 *                                              (ASC) or - (DESC); multiple
 *                                              fields comma-separated
 * @param filter     string (query, optional) - RSQL filter expression applied
 *                                              post-retrieval on the result set
 * @return List<DatiBadge> list of badge records on success,
 *         DettaglioErrore on failure
 */
GET /badges
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` (own badges only) · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "bdgId": 123, // Badge ID (primary key)
    "annFlg": 1, // Annulled flag (0=no, 1=yes)
    "badgeBlbId": 1, // Badge blob ID
    "frontImagePresent": 1, // Front image present (0=no, 1=yes)
    "rearImagePresent": 1, // Rear image present (0=no, 1=yes)
    "restFlg": 1, // Restricted flag (0=no, 1=yes)
    "consFlg": 1, // Delivered flag (0=no, 1=yes)
    "dataIni": "10/09/2019 11:00:00", // Validity start date DD/MM/YYYY HH:mm:ss
    "dataStampa": "10/10/2019 10:00:00", // Print date DD/MM/YYYY HH:mm:ss
    "dataFin": "10/10/2019 10:00:00", // Validity end date DD/MM/YYYY HH:mm:ss
    "dataConsegna": "10/10/2019 10:00:00", // Delivery date DD/MM/YYYY HH:mm:ss
    "persId": 1, // Person ID
    "stuId": 123, // Career ID
    "matId": 1, // Career segment ID
    "matricola": "123456", // Student registration number
    "cognome": "Rossi", // Last name
    "nome": "Mario", // First name
    "codFis": "string", // Tax code
    "statoNascita": "ITALIA", // Birth country
    "statoResidenza": "ITALIA", // Residence country
    "codCds": "CDS_1", // Degree course code
    "desCds": "string", // Degree course description
    "codFac": "65", // Faculty code
    "desFac": "string", // Faculty description
    "aaIscrAnn": 2016, // Enrollment year
    "rfid": "83", // Badge RFID code
    "codUniversita": "A", // University code
    "universita": "A", // University name
    "staStuCod": "A", // Student status code
    "staMatCod": "A" // Registration status code
  }
]
```

**`422 Unprocessable Entity`** - Invalid parameters.

```json
{
  "statusCode": 200, // HTTP status code
  "retCode": -1, // Internal error code
  "retErrMsg": "string", // Error description
  "errDetails": [
    {
      "errorType": "string", // Error type (e.g. stackTrace)
      "value": "string", // Error detail
      "rawValue": "string" // Raw error detail (JSON)
    }
  ]
}
```

<br>

---

<br>

### `GET /badges/blobs/{badgeBlobId}/front` - Download badge front image

```java
/**
 * Returns the front page image of a specific badge blob as a binary
 * octet-stream. When called with STUDENTE auth, only badges linked
 * to the authenticated student are accessible.
 *
 * @param badgeBlobId long (path, required) - badge blob ID containing
 *                                            the badge images
 * @return byte[] raw front image as application/octet-stream on success,
 *         DettaglioErrore on failure
 */
GET /badges/blobs/{badgeBlobId}/front
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` (own badge only) · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

**Response Content-Type:** `application/octet-stream`

#### Response

**`200 OK`** - Returns the raw binary front image.

**`422 Unprocessable Entity`** - Invalid parameters.

```json
{
  "statusCode": 200, // HTTP status code
  "retCode": -1, // Internal error code
  "retErrMsg": "string", // Error description
  "errDetails": [
    {
      "errorType": "string", // Error type (e.g. stackTrace)
      "value": "string", // Error detail
      "rawValue": "string" // Raw error detail (JSON)
    }
  ]
}
```

<br>

---

<br>

### `GET /badges/blobs/{badgeBlobId}/rear` - Download badge rear image

```java
/**
 * Returns the rear page image of a specific badge blob as a binary
 * octet-stream. When called with STUDENTE auth, only badges linked
 * to the authenticated student are accessible.
 *
 * @param badgeBlobId long (path, required) - badge blob ID containing
 *                                            the badge images
 * @return byte[] raw rear image as application/octet-stream on success,
 *         DettaglioErrore on failure
 */
GET /badges/blobs/{badgeBlobId}/rear
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` (own badge only) · Supported: `Basic`, `JWT`
**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled
**Response Content-Type:** `application/octet-stream`

#### Response

**`200 OK`** - Returns the raw binary rear image.

**`422 Unprocessable Entity`** - Invalid parameters.

```json
{
  "statusCode": 200, // HTTP status code
  "retCode": -1, // Internal error code
  "retErrMsg": "string", // Error description
  "errDetails": [
    {
      "errorType": "string", // Error type (e.g. stackTrace)
      "value": "string", // Error detail
      "rawValue": "string" // Raw error detail (JSON)
    }
  ]
}
```

---

## References

- **Swagger UI:** [Badge Api V1 - ESSE3 REST Docs](<https://unimol.esse3.cineca.it/e3rest/docs/?urls.primaryName=Badge%20Api%20V1%20(https%3A%2F%2Funimol.esse3.cineca.it%2Fe3rest%2Fapi%2Fbadge-service-v1)>)
- **Spec YAML:** [p18-badgeApiV1.yaml](https://unimol.esse3.cineca.it/e3rest/api/swagger-service-v1/swagger/specs/p18-badgeApiV1.yaml)
- **ESSE3 REST API General Documentation:** [wiki.u-gov.it](https://wiki.u-gov.it/confluence/display/ESSE3/Servizi+REST+su+ESSE3)

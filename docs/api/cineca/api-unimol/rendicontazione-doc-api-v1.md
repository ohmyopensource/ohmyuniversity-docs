---
title: Rendicontazione Doc API V1 | OhMyUniversity!
description: REST API documentation for the Rendicontazione Doc service (rendicontazione-doc-service-v1) - teacher registry and diary reporting in CINECA ESSE3.
head:
  - - meta
    - property: og:title
      content: Rendicontazione Doc API V1 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Rendicontazione Doc service (rendicontazione-doc-service-v1) - teacher registry and diary reporting in CINECA ESSE3.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/cineca/api-unimol/rendicontazione-doc-api-v1
  - - meta
    - name: keywords
      content: rendicontazione docente api, teacher registry api, diario docente, registro docente, esse3 rest api, cineca api, ohmyuniversity api, rendicontazione-doc-service-v1
  - - meta
    - name: twitter:title
      content: Rendicontazione Doc API V1 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Rendicontazione Doc service (rendicontazione-doc-service-v1) - teacher registry and diary reporting in CINECA ESSE3.
---

# OhMyUniversity! - Unimol: Rendicontazione Doc API V1

**ENG:** `Teacher Reporting`

**Version:** `1.0.0` · **Base URL:** `/rendicontazione-doc-service-v1`

Service for accessing teacher reporting data in ESSE3, covering both the teacher registry and the teacher diary.

---

## Covered entities

| Entity            | Description                                      | Tag        |
| ----------------- | ------------------------------------------------ | ---------- |
| `RegistroDocente` | Header and detail of a teacher's course registry | `registro` |
| `DiarioDocente`   | Header and detail of a teacher's activity diary  | `diario`   |

---

## Changelog

| Version | ESSE3 Release | Changes         |
| ------- | ------------- | --------------- |
| 1.0.0   | 21.12.02.00   | Initial release |

---

## Endpoints - Teacher Registry (Registro)

### `GET /registri` - Filter teacher registry headers

```java
/**
 * Returns a filtered list of teacher registry headers (testate).
 * Each entry represents a single teacher's course registry for a given
 * academic offer year, including status, logistics, hours, and
 * partition data.
 *
 * @param aaOffId                int    (query, optional) - academic offer year ID, range: 1900–2100
 * @param facCod                 string (query, optional) - faculty code
 * @param adCod                  string (query, optional) - teaching activity code
 * @param docenteId              long   (query, optional) - teacher ID
 * @param codFis                 string (query, optional) - teacher's fiscal code
 * @param matricola              string (query, optional) - teacher's registration number
 * @param cognome                string (query, optional) - teacher's surname; at least 3 characters
 *                                                          required, append * for LIKE search
 * @param staRegCod              string (query, optional) - registry status; valid values: B, C, S,
 *                                                          V, A, X; multiple values comma-separated
 * @param daUltimaDataTransStato string (query, optional) - minimum last state transition date;
 *                                                          returns registries with date >= value or null
 * @param start                  int    (query, optional) - index of the first record to load,
 *                                                          defaults to 0
 * @param limit                  int    (query, optional) - number of records to retrieve starting
 *                                                          from start, defaults to 50,
 *                                                          allowed range: 0–100
 * @param order                  string (query, optional) - sort order; syntax: +/- followed by
 *                                                          field name (+= ASC, -= DESC);
 *                                                          multiple fields comma-separated
 * @param fields                 string (query, optional) - list of optional fields to include;
 *                                                          use ALL to return all fields;
 *                                                          supports Ant Glob Patterns
 * @param optionalFields         string (query, optional) - alias for fields; same behavior
 * @return List<RegistroDocente> paginated list of teacher registry headers,
 *         or an empty array if none match the filters
 */
GET /registri
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent`

#### Response

**`200 OK`**

```json
[
  {
    "regId": 1, // Registry ID (primary key)
    "aaOffId": 2020, // Academic offer year ID
    "docenteId": 1, // Teacher ID
    "cognome": "Rossi", // Teacher's surname
    "nome": "Mario", // Teacher's name
    "codFis": "MRORSS55F12H456F", // Teacher's fiscal code
    "matricola": "12345", // Teacher's registration number
    "fatPartCod": "N0", // Partition factor code
    "fatPartDes": "Nessun partizionamento", // Partition factor description
    "domPartCod": "N0", // Partition domain code
    "domPartDes": "Nessun partizionamento", // Partition domain description
    "partCod": "N0", // Semester partition code
    "adLogId": 1, // Logistics sharing ID
    "statoRegCod": "S", // Registry status code
    "statoRegDes": "Stampato", // Registry status description
    "tipoGestRegCod": "STD", // Registry management type
    "firmaDigitaleFlg": 0, // Digital signature flag (0=no, 1=yes)
    "regadDataStampa": "10/10/2020", // Print date (DD/MM/YYYY)
    "regadFinitaDidFlg": 0, // Teaching completed flag (0=no, 1=yes)
    "numStuL1": 0, // Students present at first lecture
    "numStuL4": 0, // Students present at fourth lecture
    "numStuMedio": 0, // Average number of attending students
    "oreRiconosciute": 0, // Recognized hours out of reported hours
    "eccedenza": 0, // Excess hours
    "liquidatoFlg": 0, // Payment settled flag (0=no, 1=yes)
    "osservazioni": "lorem ipsum sic ..", // Teacher's notes on the registry
    "dataUltimoTransStato": "10/11/2022", // Last state transition date (DD/MM/YYYY)
    "identificativiCoperture": [
      // Coverage identifiers (optional field)
      {
        "coperId": 1 // Coverage ID imported from U-GOV/GDA
      }
    ],
    "totOreDid": 10, // Total reported frontal teaching hours
    "totOreAltro": 10 // Total reported other activity hours
  }
]
```

**`422 Unprocessable Entity`**

```json
{
  "statusCode": 200,
  "retCode": -1,
  "retErrMsg": "Parametri non corretti",
  "errDetails": [
    {
      "errorType": "stackTrace",
      "value": "SocketTimeoutException....",
      "rawValue": "SocketTimeoutException...."
    }
  ]
}
```

<br>

---

<br>

### `GET /registri/{regId}` - Get teacher registry by ID

```java
/**
 * Returns the full details of a single teacher registry, identified by its
 * unique ID. The response extends the base registry header with logistics
 * sharing data and the full list of reported teaching activities.
 *
 * @param regId          long   (path, required)  - unique registry ID
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @return RegistroDocenteConDettagli the full registry with logistics and
 *         activity details, or 404 if not found
 */
GET /registri/{regId}
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent`

#### Response

**`200 OK`**

```json
[
  {
    "regId": 1, // Registry ID (primary key)
    "aaOffId": 2020, // Academic offer year ID
    "docenteId": 1, // Teacher ID
    "cognome": "Rossi", // Teacher's surname
    "nome": "Mario", // Teacher's name
    "codFis": "MRORSS55F12H456F", // Teacher's fiscal code
    "matricola": "12345", // Teacher's registration number
    "fatPartCod": "N0", // Partition factor code
    "fatPartDes": "Nessun partizionamento", // Partition factor description
    "domPartCod": "N0", // Partition domain code
    "domPartDes": "Nessun partizionamento", // Partition domain description
    "partCod": "N0", // Semester partition code
    "adLogId": 1, // Logistics sharing ID
    "statoRegCod": "S", // Registry status code
    "statoRegDes": "Stampato", // Registry status description
    "tipoGestRegCod": "STD", // Registry management type
    "firmaDigitaleFlg": 0, // Digital signature flag (0=no, 1=yes)
    "regadDataStampa": "10/10/2020", // Print date (DD/MM/YYYY)
    "regadFinitaDidFlg": 0, // Teaching completed flag (0=no, 1=yes)
    "numStuL1": 0, // Students present at first lecture
    "numStuL4": 0, // Students present at fourth lecture
    "numStuMedio": 0, // Average number of attending students
    "oreRiconosciute": 0, // Recognized hours out of reported hours
    "eccedenza": 0, // Excess hours
    "liquidatoFlg": 0, // Payment settled flag (0=no, 1=yes)
    "osservazioni": "lorem ipsum sic ..", // Teacher's notes on the registry
    "dataUltimoTransStato": "10/11/2022", // Last state transition date (DD/MM/YYYY)
    "identificativiCoperture": [
      // Coverage identifiers (optional field)
      {
        "coperId": 1 // Coverage ID imported from U-GOV/GDA
      }
    ],
    "totOreDid": 10, // Total reported frontal teaching hours
    "totOreAltro": 10, // Total reported other activity hours
    "logistica": [
      // Logistics sharing entries
      {
        "cdsId": 11, // Degree course ID (primary key)
        "adId": 111, // Teaching activity ID (primary key)
        "udId": 1111, // Teaching unit ID (primary key)
        "cdsCod": "CDS_COD1", // Degree course code
        "cdsDes": "Corso di studio 1", // Degree course description
        "adCod": "AD_COD1", // Teaching activity code
        "adDes": "Attività didattica 1", // Teaching activity description
        "udCod": "UD_COD1", // Teaching unit code
        "udDes": "Unità didattica 1", // Teaching unit description
        "fisicaFlg": 1, // Physical delivery flag (0=no, 1=yes)
        "masterFlg": 1 // Master unit flag for logistics (0=no, 1=yes)
      }
    ],
    "attivita": [
      // Reported teaching activity entries
      {
        "dettRegId": 1, // Activity detail ID (primary key)
        "tipoAttCod": "LEZ", // Activity type code
        "tipoCreCod": "LEZ", // Credit type code
        "tipoAttDes": "Lezione", // Activity type description
        "data": "10/12/2021", // Activity date (DD/MM/YYYY)
        "oraInizio": "900", // Start time (hh:mm)
        "oraFine": "900", // End time (hh:mm)
        "oreAccademiche": 12.5, // Academic hours (may differ from oraFine - oraInizio)
        "titolo": "titolo lezione", // Activity title
        "des": "lorem ipsum sic ...", // Activity description
        "nota": "lorem ipsum sic...", // Teacher's note on the activity
        "supplenti": "Rossi, Bianchi", // Substitute teachers list
        "udCod": "UD1", // Teaching unit code for this activity
        "udDes": "Unità didattica 1", // Teaching unit description
        "gruppi": [
          // Student groups (optional field)
          {
            "des": "gruppo 1" // Group description
          }
        ]
      }
    ]
  }
]
```

<br>

---

<br>

## Endpoints - Teacher Diary (Diario)

### `GET /diari` - Filter teacher diary headers

```java
/**
 * Returns a filtered list of teacher diary headers (testate).
 * Each entry represents a single teacher's activity diary for a given
 * year, including status, reported hours, and diary management type.
 *
 * @param aaId         int    (query, optional) - diary year ID, range: 1900–2100
 * @param docenteId    long   (query, optional) - teacher ID
 * @param codFis       string (query, optional) - teacher's fiscal code
 * @param matricola    string (query, optional) - teacher's registration number
 * @param cognome      string (query, optional) - teacher's surname; at least 3 characters
 *                                                required, append * for LIKE search
 * @param staDiarioCod string (query, optional) - diary status; valid values: B, S, A
 * @param start        int    (query, optional) - index of the first record to load,
 *                                                defaults to 0
 * @param limit        int    (query, optional) - number of records to retrieve starting
 *                                                from start, defaults to 50,
 *                                                allowed range: 0–100
 * @param order        string (query, optional) - sort order; syntax: +/- followed by
 *                                                field name (+ = ASC, - = DESC);
 *                                                multiple fields comma-separated
 * @param fields       string (query, optional) - list of optional fields to include;
 *                                                use ALL to return all fields;
 *                                                supports Ant Glob Patterns
 * @return List<DiarioDocente> paginated list of teacher diary headers,
 *         or an empty array if none match the filters
 */
GET /diari
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent`

#### Response

**`200 OK`**

```json
[
  {
    "diarioId": 1, // Diary ID (primary key)
    "aaId": 1, // Diary year ID
    "docenteId": 1, // Teacher ID
    "cognome": "Rossi", // Teacher's surname
    "nome": "Mario", // Teacher's name
    "codFis": "MRORSS55F12H456F", // Teacher's fiscal code
    "statoDiarioCod": "S", // Diary status code
    "statoDiarioDes": "Stampato", // Diary status description
    "tipoGestDiarioDocCod": "STD", // Diary management type
    "firmaDigitaleFlg": 0, // Digital signature flag (0=no, 1=yes)
    "osservazioni": "string", // Teacher's notes on the diary
    "oreDett": 1, // Total reported detail hours
    "oreDettAnnuali": 1 // Total reported annual detail hours
  }
]
```

**`422 Unprocessable Entity`**

```json
{
  "statusCode": 200,
  "retCode": -1,
  "retErrMsg": "Parametri non corretti",
  "errDetails": [
    {
      "errorType": "stackTrace",
      "value": "SocketTimeoutException....",
      "rawValue": "SocketTimeoutException...."
    }
  ]
}
```

<br>

---

<br>

### `GET /diari/{diarioId}` - Get teacher diary by ID

```java
/**
 * Returns the full details of a single teacher diary, identified by its
 * unique ID. The response extends the base diary header with the list of
 * reported daily activities, annual activity summaries, and teacher notes.
 *
 * @param diarioId long (path, required) - unique diary ID
 * @return DiarioDocenteConDettagli the full diary with activity details,
 *         annual summaries, and notes, or 404 if not found
 */
GET /diari/{diarioId}
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent`

#### Response

**`200 OK`**

```json
[
  {
    "diarioId": 1, // Diary ID (primary key)
    "aaId": 1, // Diary year ID
    "docenteId": 1, // Teacher ID
    "cognome": "Rossi", // Teacher's surname
    "nome": "Mario", // Teacher's name
    "codFis": "MRORSS55F12H456F", // Teacher's fiscal code
    "statoDiarioCod": "S", // Diary status code
    "statoDiarioDes": "Stampato", // Diary status description
    "tipoGestDiarioDocCod": "STD", // Diary management type
    "firmaDigitaleFlg": 0, // Digital signature flag (0=no, 1=yes)
    "osservazioni": "string", // Teacher's notes on the diary
    "oreDett": 1, // Total reported detail hours
    "oreDettAnnuali": 1, // Total reported annual detail hours
    "attivita": [
      // Reported daily activity entries
      {
        "dettDiarioId": 1, // Activity detail ID
        "tipoAttCod": "LEZ", // Activity type code
        "tipoAttDes": "Lezione", // Activity type description
        "data": "10/12/2021", // Activity date (DD/MM/YYYY)
        "ore": 1, // Reported hours
        "minuti": 30 // Reported minutes
      }
    ],
    "attivitaAnnuali": [
      // Annual activity summary entries
      {
        "dettAaDiarioId": 1, // Annual activity detail ID
        "tipoAttCod": "LEZ", // Activity type code
        "tipoAttDes": "Lezione", // Activity type description
        "ore": 1, // Reported hours
        "minuti": 30, // Reported minutes
        "orePrev": 1, // Planned hours
        "minutiPrev": 30 // Planned minutes
      }
    ],
    "note": [
      // Teacher notes on the diary
      {
        "notaDiarioId": 1, // Note ID
        "nota": "lorem ipsum sic.." // Note text
      }
    ]
  }
]
```

**`422 Unprocessable Entity`**

```json
{
  "statusCode": 200,
  "retCode": -1,
  "retErrMsg": "Parametri non corretti",
  "errDetails": [
    {
      "errorType": "stackTrace",
      "value": "SocketTimeoutException....",
      "rawValue": "SocketTimeoutException...."
    }
  ]
}
```

---

## References

- **Swagger UI:** [Rendicontazione Doc Api V1 - ESSE3 REST Docs](<https://unimol.esse3.cineca.it/e3rest/docs/?urls.primaryName=Rendicontazione%20Doc%20Api%20V1%20(https%3A%2F%2Funimol.esse3.cineca.it%2Fe3rest%2Fapi%2Frendicontazione-doc-service-v1)#/>)
- **Spec YAML:** [p09-rendicontazioneDocApiV1.yaml](https://unimol.esse3.cineca.it/e3rest/api/swagger-service-v1/swagger/specs/p09-rendicontazioneDocApiV1.yaml)
- **ESSE3 REST API General Documentation:** [wiki.u-gov.it](https://wiki.u-gov.it/confluence/display/ESSE3/Servizi+REST+su+ESSE3)

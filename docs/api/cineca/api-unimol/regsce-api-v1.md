---
title: Regsce API V1 | OhMyUniversity!
description: REST API documentation for the Regsce service (regsce-service-v1) - access to study plan selection regulations in CINECA ESSE3.
head:
  - - meta
    - property: og:title
      content: Regsce API V1 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Regsce service (regsce-service-v1) - access to study plan selection regulations in CINECA ESSE3.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/cineca/api-unimol/regsce-api-v1
  - - meta
    - name: keywords
      content: regsce api, regolamento di scelta api, study plan regulation, esse3 rest api, cineca api, ohmyuniversity api, regsce-service-v1, schemi di piano, regole di scelta, finestre di compilazione
  - - meta
    - name: twitter:title
      content: Regsce API V1 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Regsce service (regsce-service-v1) - access to study plan selection regulations in CINECA ESSE3.
---

# OhMyUniversity! - Unimol: Regsce API V1

**ENG:** `Study Plan Selection Regulation`

**Version:** `1.1.0` · **Base URL:** `/regsce-service-v1`

Service for accessing study plan selection regulations in ESSE3, including regulation headers, compilation windows, plan schemas, selection rules, and associated study plans.

---

## Covered entities

| Entity                        | Description                                 | Tag               |
| ----------------------------- | ------------------------------------------- | ----------------- |
| `RegolamentoDiScelta`         | Header of a study plan selection regulation | `regolamento`     |
| `FinestraRegolamentoDiScelta` | Compilation window linked to a regulation   | `finestra`        |
| `SchemaDiPiano`               | Plan schema associated with a regulation    | `schema di piano` |
| `RegolaDiScelta`              | Selection rule within a plan schema         | `regola`          |
| `PianoDiStudio`               | Study plan linked to a selection rule       | `piano`           |

> Bulk retrieval endpoints for regulations are available under the `massivo` tag.

---

## Changelog

| Version | ESSE3 Release | Changes                                                                                            |
| ------- | ------------- | -------------------------------------------------------------------------------------------------- |
| 1.0.0   | -             | Initial release                                                                                    |
| 1.1.0   | 18.02.00.00   | Added optional field `dataUltimaModifica` to `RegolamentoDiScelta` and related filter on `/regsce` |

---

## Endpoints - Regulation Header (Regolamento)

### `GET /regsce` - Filter study plan selection regulations

```java
/**
 * Returns a filtered list of study plan selection regulation headers.
 * At least one filter parameter must be provided to perform the query.
 * If statoRegsce is not specified, only active regulations (stato = A)
 * are returned by default.
 *
 * @param statoRegsce    string[] (query, optional) - regulation status; valid values: A, B, X;
 *                                                    multiple values allowed; defaults to A
 * @param facId          long   (query, optional)   - faculty ID
 * @param facCod         string (query, optional)   - faculty code
 * @param cdsId          long   (query, optional)   - degree course ID
 * @param cdsCod         string (query, optional)   - degree course code
 * @param aaOrdId        long   (query, optional)   - curriculum ordering year
 * @param aaRevisioneId  long   (query, optional)   - revision year
 * @param tipoCorsoCod   string (query, optional)   - course type code
 * @param coorte         long   (query, optional)   - student cohort year
 * @param daDataMod      string (query, optional)   - minimum last modification date;
 *                                                    returns records modified after this date
 * @param start          int    (query, optional)   - index of the first record to load,
 *                                                    defaults to 0
 * @param limit          int    (query, optional)   - number of records to retrieve starting
 *                                                    from start, defaults to 50,
 *                                                    allowed range: 0–100
 * @param order          string (query, optional)   - sort order; syntax: +/- followed by
 *                                                    field name (+ = ASC, - = DESC);
 *                                                    multiple fields comma-separated
 * @param fields         string (query, optional)   - list of optional fields to include;
 *                                                    use ALL to return all fields;
 *                                                    supports Ant Glob Patterns
 * @param optionalFields string (query, optional)   - alias for fields; same behavior
 * @return List<RegolamentoDiScelta> paginated list of regulation headers,
 *         or an empty array if none match the filters
 */
GET /regsce
```

**Auth:** Public · Supported: `Basic`, `JWT`

**Cache:** `configuration`

::: warning
At least one filter parameter must be provided. Requests with no filters will be rejected.
:::

#### Response

**`200 OK`**

```json
[
  {
    "regsceId": 123, // Regulation ID (primary key)
    "facId": 123, // Faculty ID
    "facCod": "123", // Faculty code
    "tipoCorsoCod": "123", // Course type code
    "cdsId": 123, // Degree course ID
    "cdsCod": "123", // Degree course code
    "cdsDes": "123", // Degree course description
    "aaOrdId": 123, // Curriculum ordering year
    "coorte": 2012, // Student cohort year
    "aaRevisioneId": 2012, // Revision year
    "stato": "A", // Regulation status (A=active, B=draft, X=cancelled)
    "dataUltimaModifica": "15/10/2015", // Last modification date (DD/MM/YYYY) (optional field)
    "dataInserimento": "15/10/2015" // Insertion date (DD/MM/YYYY) (optional field)
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

### `GET /regsce/{regsceId}` - Get regulation with schemas

```java
/**
 * Returns a single study plan selection regulation identified by its unique ID,
 * including the full list of associated plan schemas. The response structure
 * follows a 1-n relation between the regulation header and its schemas.
 *
 * Optionally includes compilation windows via the fields/optionalFields parameter.
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @param order          string (query, optional) - sort order; syntax: +/- followed by
 *                                                  field name (+ = ASC, - = DESC);
 *                                                  multiple fields comma-separated
 * @param filter         string (query, optional) - RSQL filter expression applied
 *                                                  after data retrieval
 * @return RegolamentoDiSceltaConSchemi the regulation header with compilation windows
 *         (optional) and plan schemas, or 404 if not found
 */
GET /regsce/{regsceId}
```

**Auth:** Public · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
{
  "regsceId": 123, // Regulation ID (primary key)
  "facId": 123, // Faculty ID
  "facCod": "123", // Faculty code
  "tipoCorsoCod": "123", // Course type code
  "cdsId": 123, // Degree course ID
  "cdsCod": "123", // Degree course code
  "cdsDes": "123", // Degree course description
  "aaOrdId": 123, // Curriculum ordering year
  "coorte": 2012, // Student cohort year
  "aaRevisioneId": 2012, // Revision year
  "stato": "A", // Regulation status (A=active, B=draft, X=cancelled)
  "dataUltimaModifica": "15/10/2015", // Last modification date (DD/MM/YYYY) (optional field)
  "dataInserimento": "15/10/2015", // Insertion date (DD/MM/YYYY) (optional field)
  "finestreDiCompilazione": [
    // Compilation windows (optional field)
    {
      "finregsceId": 1222, // Compilation window ID (primary key)
      "regsceId": 123, // Parent regulation ID
      "tipoFinestra": "string", // Window type
      "dataInizio": "15/10/2015", // Start date (DD/MM/YYYY)
      "dataFine": "15/10/2015", // End date (DD/MM/YYYY)
      "extId": 1 // External ID (optional field)
    }
  ],
  "schemiDiPiano": [
    // Plan schemas associated with the regulation
    {
      "schemaId": 1, // Schema ID (primary key)
      "schemaCod": "SC_COD", // Schema code, unique within the regulation
      "schemaDes": "Descrizione schema di piano", // Schema description (IT)
      "schemaDesEng": "Descrizione in inglese schema di piano", // Schema description (EN)
      "regsceId": 123, // Parent regulation ID
      "pdsId": 1, // Study path ID
      "pdsCod": "PDS_COD", // Study path code
      "pdsDes": "Descrizione del percorso di studio", // Study path description (optional field)
      "tipoApprovazione": 0, // Approval type
      "gestAnnoCorsoFlg": 0, // Course year management flag (0=no, 1=yes)
      "statutarioFlg": 0, // Statutory flag (0=no, 1=yes)
      "dataInizioVal": "15/10/2015", // Validity start date (DD/MM/YYYY)
      "dataFineVal": "15/10/2015", // Validity end date (DD/MM/YYYY)
      "condId": 123, // SQL condition ID
      "condCod": "COND_COD", // SQL condition code
      "condDes": "Descrizione condizione sql", // SQL condition description (optional field)
      "orientId": 123, // Orientation ID
      "orientCod": "codice dell'orientamento", // Orientation code
      "orientDes": "Descrizione dell'orientamento", // Orientation description (optional field)
      "profCod": "1", // Profile code
      "profDes": "1", // Profile description (optional field)
      "aptId": 123, // Part-time alternative ID
      "aptCod": "PT_50", // Part-time alternative code
      "aptDes": "Part time al 50%", // Part-time alternative description (optional field)
      "webViewFlg": 0 // Public area visibility flag (0=no, 1=yes)
    }
  ]
}
```

<br>

---

<br>

### `PATCH /regsce/{regsceId}` - Update regulation status

```java
/**
 * Partially updates a study plan selection regulation identified by its unique ID.
 * Only the regulation status can be updated via this endpoint.
 *
 * @param regsceId       long                        (path, required)  - unique regulation ID
 * @param body           AggiornamentoRegolamentoDiScelta (body, required) - object containing
 *                                                    the fields to update; only stato is accepted:
 *                                                    valid values: A (active), B (draft)
 * @param fields         string                      (query, optional) - list of optional fields
 *                                                    to include in the response; use ALL to
 *                                                    return all fields; supports Ant Glob Patterns
 * @param optionalFields string                      (query, optional) - alias for fields;
 *                                                    same behavior
 * @param order          string                      (query, optional) - sort order; syntax: +/-
 *                                                    followed by field name (+ = ASC, - = DESC);
 *                                                    multiple fields comma-separated
 * @param filter         string                      (query, optional) - RSQL filter expression
 *                                                    applied after data retrieval
 * @return RegolamentoDiSceltaConSchemi the updated regulation with compilation windows
 *         (optional) and plan schemas, or 422 if the operation is not allowed
 */
PATCH /regsce/{regsceId}
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Request body

```json
{
  "stato": "A" // New regulation status (A=active, B=draft)
}
```

#### Response

**`200 OK`**

```json
{
  "regsceId": 123, // Regulation ID (primary key)
  "facId": 123, // Faculty ID
  "facCod": "123", // Faculty code
  "tipoCorsoCod": "123", // Course type code
  "cdsId": 123, // Degree course ID
  "cdsCod": "123", // Degree course code
  "cdsDes": "123", // Degree course description
  "aaOrdId": 123, // Curriculum ordering year
  "coorte": 2012, // Student cohort year
  "aaRevisioneId": 2012, // Revision year
  "stato": "A", // Regulation status (A=active, B=draft, X=cancelled)
  "dataUltimaModifica": "15/10/2015", // Last modification date (DD/MM/YYYY) (optional field)
  "dataInserimento": "15/10/2015", // Insertion date (DD/MM/YYYY) (optional field)
  "finestreDiCompilazione": [
    // Compilation windows (optional field)
    {
      "finregsceId": 1222, // Compilation window ID (primary key)
      "regsceId": 123, // Parent regulation ID
      "tipoFinestra": "string", // Window type
      "dataInizio": "15/10/2015", // Start date (DD/MM/YYYY)
      "dataFine": "15/10/2015", // End date (DD/MM/YYYY)
      "extId": 1 // External ID (optional field)
    }
  ],
  "schemiDiPiano": [
    // Plan schemas associated with the regulation
    {
      "schemaId": 1, // Schema ID (primary key)
      "schemaCod": "SC_COD", // Schema code, unique within the regulation
      "schemaDes": "Descrizione schema di piano", // Schema description (IT)
      "schemaDesEng": "Descrizione in inglese schema di piano", // Schema description (EN)
      "regsceId": 123, // Parent regulation ID
      "pdsId": 1, // Study path ID
      "pdsCod": "PDS_COD", // Study path code
      "pdsDes": "Descrizione del percorso di studio", // Study path description (optional field)
      "tipoApprovazione": 0, // Approval type
      "gestAnnoCorsoFlg": 0, // Course year management flag (0=no, 1=yes)
      "statutarioFlg": 0, // Statutory flag (0=no, 1=yes)
      "dataInizioVal": "15/10/2015", // Validity start date (DD/MM/YYYY)
      "dataFineVal": "15/10/2015", // Validity end date (DD/MM/YYYY)
      "condId": 123, // SQL condition ID
      "condCod": "COND_COD", // SQL condition code
      "condDes": "Descrizione condizione sql", // SQL condition description (optional field)
      "orientId": 123, // Orientation ID
      "orientCod": "codice dell'orientamento", // Orientation code
      "orientDes": "Descrizione dell'orientamento", // Orientation description (optional field)
      "profCod": "1", // Profile code
      "profDes": "1", // Profile description (optional field)
      "aptId": 123, // Part-time alternative ID
      "aptCod": "PT_50", // Part-time alternative code
      "aptDes": "Part time al 50%", // Part-time alternative description (optional field)
      "webViewFlg": 0 // Public area visibility flag (0=no, 1=yes)
    }
  ]
}
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

## Endpoints - Bulk Retrieval (Massivo)

### `GET /regsceFull/{regsceId}` - Get full regulation with all details

```java
/**
 * Returns the complete detail tree of a study plan selection regulation,
 * identified by its unique ID. The response follows a deeply nested 1-n
 * structure covering the full regulation hierarchy:
 *
 *   Regulation header
 *   └── Plan schemas
 *       └── Selection rules
 *           ├── Selection blocks
 *           │   ├── Teaching activities
 *           │   │   └── UD rules → modules
 *           │   └── Block conditions
 *           ├── Rule conditions
 *           └── Free OD filters (OR → AND)
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param order          string (query, optional) - sort order; syntax: +/- followed by
 *                                                  field name (+ = ASC, - = DESC);
 *                                                  multiple fields comma-separated
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @param filter         string (query, optional) - RSQL filter expression applied
 *                                                  after data retrieval
 * @return RegolamentoDiSceltaConDettagli the full regulation detail tree,
 *         or 404 if not found
 */
GET /regsceFull/{regsceId}
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
{
  // --- Regulation header ---
  "regsceId": 123, // Regulation ID (primary key)
  "facId": 123, // Faculty ID
  "facCod": "123", // Faculty code
  "tipoCorsoCod": "123", // Course type code
  "cdsId": 123, // Degree course ID
  "cdsCod": "123", // Degree course code
  "cdsDes": "123", // Degree course description
  "aaOrdId": 123, // Curriculum ordering year
  "coorte": 2012, // Student cohort year
  "aaRevisioneId": 2012, // Revision year
  "stato": "A", // Regulation status (A=active, B=draft, X=cancelled)
  "dataUltimaModifica": "15/10/2015", // Last modification date (DD/MM/YYYY) (optional field)
  "dataInserimento": "15/10/2015", // Insertion date (DD/MM/YYYY) (optional field)

  // --- Compilation windows (optional field) ---
  "finesteDiCompilazione": [
    {
      "finregsceId": 1222, // Compilation window ID (primary key)
      "regsceId": 123, // Parent regulation ID
      "tipoFinestra": "string", // Window type
      "dataInizio": "15/10/2015", // Start date (DD/MM/YYYY)
      "dataFine": "15/10/2015", // End date (DD/MM/YYYY)
      "extId": 1 // External ID (optional field)
    }
  ],

  // --- Plan schemas ---
  "schemiDiPiano": [
    {
      "schemaId": 1, // Schema ID (primary key)
      "schemaCod": "SC_COD", // Schema code, unique within the regulation
      "schemaDes": "Descrizione schema di piano", // Schema description (IT)
      "schemaDesEng": "Descrizione in inglese schema di piano", // Schema description (EN)
      "regsceId": 123, // Parent regulation ID
      "pdsId": 1, // Study path ID
      "pdsCod": "PDS_COD", // Study path code
      "pdsDes": "Descrizione del percorso di studio", // Study path description (optional field)
      "tipoApprovazione": 0, // Approval type
      "gestAnnoCorsoFlg": 0, // Course year management flag (0=no, 1=yes)
      "statutarioFlg": 0, // Statutory flag (0=no, 1=yes)
      "dataInizioVal": "15/10/2015", // Validity start date (DD/MM/YYYY)
      "dataFineVal": "15/10/2015", // Validity end date (DD/MM/YYYY)
      "condId": 123, // SQL condition ID
      "condCod": "COND_COD", // SQL condition code
      "condDes": "Descrizione condizione sql", // SQL condition description (optional field)
      "orientId": 123, // Orientation ID
      "orientCod": "codice dell'orientamento", // Orientation code
      "orientDes": "Descrizione dell'orientamento", // Orientation description (optional field)
      "profCod": "1", // Profile code
      "profDes": "1", // Profile description (optional field)
      "aptId": 123, // Part-time alternative ID
      "aptCod": "PT_50", // Part-time alternative code
      "aptDes": "Part time al 50%", // Part-time alternative description (optional field)
      "webViewFlg": 0, // Public area visibility flag (0=no, 1=yes)

      // --- Selection rules ---
      "regoleDiScelta": [
        {
          "sceltaId": 1234, // Selection rule ID (primary key)
          "regsceId": 123, // Parent regulation ID
          "sceId": 12, // Rule sequence ID
          "ordNum": 12, // Display order
          "des": "Descrizione della regola di scelta", // Rule description (IT)
          "desEng": "Descrizione inglese della regola di scelta", // Rule description (EN)
          "pdsId": 1, // Study path ID
          "pdsCod": "PDS_COD", // Study path code
          "aptId": 123, // Part-time alternative ID
          "aptCod": "PT_50", // Part-time alternative code
          "annoCorso": 1, // Course year
          "annoCorsoAnticipo": 1, // Anticipated course year
          "tipSce": "O", // Rule type code
          "tipSceDes": "regola da Elenco", // Rule type description
          "tipUnt": "CFU", // Unit type (CFU, ORE, etc.)
          "minUnt": 1, // Minimum units required
          "maxUnt": 1, // Maximum units allowed
          "vinId": 1, // Constraint ID
          "livello": 1, // Nesting level
          "modTAF": "A", // TAF mode
          "abilFlg": 0, // Enabled flag (optional field) (0=no, 1=yes)
          "opzFlg": 0, // Optional flag (0=no, 1=yes)
          "sovranFlg": 0, // Sovereign flag (0=no, 1=yes)
          "tesorettoFlg": 0, // Tesoretto flag (0=no, 1=yes)
          "pesoRosaRist": 0, // Rosa restriction weight (optional field)
          "assegnazionePostiFlg": 0, // Seat assignment flag (optional field) (0=no, 1=yes)
          "deliberaFlg": 0, // Deliberation flag (optional field) (0=no, 1=yes)
          "azzeraCfuFlg": 0, // Reset CFU flag (optional field) (0=no, 1=yes)
          "parametriLogisticaFlg": 0, // Logistics parameters flag (optional field) (0=no, 1=yes)
          "notaPre": "nota pre", // Pre-note (IT) (optional field)
          "notaPreEng": "nota pre in inglese", // Pre-note (EN) (optional field)
          "notaPreVisPubblFlg": 0, // Pre-note public visibility (optional field) (0=no, 1=yes)
          "notaPost": "nota post", // Post-note (IT) (optional field)
          "notaPostEng": "nota post in inglese", // Post-note (EN) (optional field)
          "notaPostVisPubblFlg": 0, // Post-note public visibility (optional field) (0=no, 1=yes)
          "extId": 1, // External ID (optional field)
          "extCod": "EXT_COD", // External code (optional field)
          "schemaId": 1, // Parent schema ID
          "schemaCod": "SC_COD", // Parent schema code
          "ptSlotId": 2, // Part-time slot ID
          "ptSlotCod": "PT_COD", // Part-time slot code
          "ptSlotDes": "Descrizione dello slot", // Part-time slot description (optional field)

          // --- Selection blocks ---
          "blocchi": [
            {
              "sceltaId": 1234, // Parent rule ID (primary key)
              "blkId": 1, // Block ID (primary key)
              "regsceId": 123, // Parent regulation ID (optional field)
              "linguaId": 1, // Language ID
              "linguaCod": "eng", // ISO 639-2 language code
              "linguaNum": 1, // Language number
              "defFlg": 0, // Default block flag (0=no, 1=yes)
              "ctrlFlg": 0, // Control flag (0=no, 1=yes)
              "aaOffAdId": 2012, // Teaching activity offer year ID

              // --- Teaching activities ---
              "attivita": [
                {
                  "sceltaAdId": 123, // Activity entry ID (primary key)
                  "regsceId": 123, // Parent regulation ID (optional field)
                  "sceltaId": 1234, // Parent rule ID (optional field)
                  "regUdDesAuto": "Selezionare 1 modulo", // Auto UD rule description
                  "regUdDesUte": "Selezionare 1 modulo", // User UD rule description
                  "blkId": 1, // Parent block ID (optional field)
                  "peso": 4, // Weight
                  "chiaveADContestualizzata": {
                    // Contextualized AD key
                    "cdsId": 1, // Degree course ID
                    "cdsCod": "CDS_AD_1",
                    "cdsDes": "Esempio di CDS AD",
                    "aaOrdId": 2016, // Curriculum ordering year
                    "aaOrdCod": "CDS_AD_1",
                    "aaOrdDes": "Esempio di CDS AD",
                    "pdsId": 1,
                    "pdsCod": "PDS_AD_1",
                    "pdsDes": "Esempio di PDS AD",
                    "aaOffId": 1, // Offer year ID
                    "adId": 1, // Teaching activity ID
                    "adCod": "PDS_AD_1",
                    "adDes": "Esempio di PDS AD",
                    "afId": 1 // Teaching load ID
                  },

                  // --- UD rules ---
                  "regoleUD": [
                    {
                      "regUdId": 123, // UD rule ID (primary key)
                      "blkId": 1,
                      "sceltaAdId": 123, // Parent activity ID (primary key)
                      "regsceId": 123, // Parent regulation ID (optional field)
                      "tipoUdCod": "string", // UD type code
                      "tipo1": "LEZ", // Type slot 1
                      "um1": "UD", // Unit of measure slot 1
                      "qta1": 1, // Quantity slot 1
                      "tipo2": "LEZ", // Type slot 2
                      "um2": "UD", // Unit of measure slot 2
                      "qta2": 1, // Quantity slot 2
                      "tipo3": "LEZ", // Type slot 3
                      "um3": "UD", // Unit of measure slot 3
                      "qta3": 1, // Quantity slot 3

                      // --- Modules ---
                      "moduli": [
                        {
                          "udId": 123, // Module ID (primary key)
                          "regUdId": 123, // Parent UD rule ID (primary key)
                          "blkId": 1,
                          "sceltaAdId": 123, // Parent activity ID (primary key)
                          "statutFlg": 0, // Statutory flag (0=no, 1=yes)
                          "obbligFlg": 0, // Mandatory flag (0=no, 1=yes)
                          "chiaveUDContestualizzata": {
                            // Contextualized UD key
                            "chiaveAdContestualizzata": {
                              "cdsId": 1,
                              "cdsCod": "CDS_AD_1",
                              "cdsDes": "Esempio di CDS AD",
                              "aaOrdId": 2016,
                              "aaOrdCod": "CDS_AD_1",
                              "aaOrdDes": "Esempio di CDS AD",
                              "pdsId": 1,
                              "pdsCod": "PDS_AD_1",
                              "pdsDes": "Esempio di PDS AD",
                              "aaOffId": 1,
                              "adId": 1,
                              "adCod": "PDS_AD_1",
                              "adDes": "Esempio di PDS AD",
                              "afId": 1
                            },
                            "udId": 1,
                            "udCod": "CDS_AD_1",
                            "udDes": "Esempio di CDS AD",
                            "udDesEng": "Example of Description"
                          },
                          "extId": 1 // External ID (optional field)
                        }
                      ]
                    }
                  ]
                }
              ],

              // --- Block conditions ---
              "condizioni": [
                {
                  "sceltaId": 1234, // Parent rule ID (primary key)
                  "regsceId": 123, // Parent regulation ID (optional field)
                  "tipoCondCod": "A", // Condition type code
                  "valSelId": 1, // Selected value ID
                  "valSelCod": "1", // Selected value code
                  "valSelDes": "1", // Selected value description
                  "notFlg": 0, // NOT flag (0=no, 1=yes)
                  "extId": 1, // External ID (optional field)
                  "condBlkId": 0, // Block condition ID (primary key)
                  "blkId": 1, // Parent block ID (primary key)
                  "manualeFlg": 1 // Manual flag (0=no, 1=yes)
                }
              ],
              "extId": 1 // Block external ID (optional field)
            }
          ],

          // --- Rule conditions ---
          "condizioni": [
            {
              "sceltaId": 1234, // Parent rule ID (primary key)
              "regsceId": 123, // Parent regulation ID (optional field)
              "tipoCondCod": "A", // Condition type code
              "valSelId": 1, // Selected value ID
              "valSelCod": "1", // Selected value code
              "valSelDes": "1", // Selected value description
              "notFlg": 0, // NOT flag (0=no, 1=yes)
              "extId": 1, // External ID (optional field)
              "condSceId": 0 // Rule condition ID (primary key)
            }
          ],

          // --- Free OD filters ---
          "filtriOD": [
            {
              "sceltaId": 1234, // Parent rule ID (primary key)
              "orId": 0, // OR filter ID (primary key)
              "regsceId": 123, // Parent regulation ID (optional field)
              "des": "condizione or 1", // OR filter description
              "filtriAND": [
                // AND filters within this OR group
                {
                  "sceltaId": 1234, // Parent rule ID (primary key)
                  "orId": 0, // Parent OR filter ID (primary key)
                  "andId": 1, // AND filter ID (primary key)
                  "regsceId": 123, // Parent regulation ID (optional field)
                  "tipoFiltroCod": "string", // Filter type code
                  "tipoFiltroDes": "string", // Filter type description
                  "valSelId": 1, // Selected value ID
                  "valSelCod": "1", // Selected value code
                  "valSelDes": "1", // Selected value description
                  "notFlg": 0, // NOT flag (0=no, 1=yes)
                  "extId": 1 // External ID (optional field)
                }
              ],
              "extId": 1 // OR filter external ID (optional field)
            }
          ]
        }
      ]
    }
  ]
}
```

<br>

---

<br>

### `GET /regsceFull/{regsceId}/regprop` - Get prerequisite regulation for a selection regulation

```java
/**
 * Returns the prerequisite regulation (RegolamentoDiPropedeuticita) associated
 * with a study plan selection regulation. The lookup uses the same key as the
 * selection regulation (cdsId, aaOrdId, coorte, aaRevisioneId).
 *
 * The response follows a nested 1-n structure:
 *
 *   Prerequisite regulation header
 *   └── Constraints (vincoli)
 *       └── OR rules
 *           └── AND rules
 *               └── Prerequisite elements (figli)
 *
 * @param regsceId       long   (path, required)  - unique selection regulation ID used
 *                                                  to resolve the prerequisite regulation
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @param filter         string (query, optional) - RSQL filter expression applied
 *                                                  after data retrieval
 * @return RegolamentoDiPropedeuticita the full prerequisite regulation tree,
 *         or 404 if not found
 */
GET /regsceFull/{regsceId}/regprop
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
{
  // --- Prerequisite regulation header ---
  "regpropId": 1, // Prerequisite regulation ID (primary key)
  "facId": 123, // Faculty ID
  "facCod": "123", // Faculty code
  "tipoCorsoCod": "123", // Course type code
  "cdsId": 123, // Degree course ID
  "cdsCod": "123", // Degree course code
  "cdsDes": "123", // Degree course description
  "aaOrdId": 123, // Curriculum ordering year
  "coorte": 2012, // Student cohort year
  "aaRevisioneId": 2012, // Revision year
  "stato": "A", // Regulation status (A=active, B=draft, X=cancelled)
  "extId": 1, // External ID (optional field)

  // --- Constraints ---
  "vincoli": [
    {
      "regpropVincId": 1, // Constraint ID (primary key)
      "regpropId": 1, // Parent regulation ID
      "tipoVincolo": "AD", // Constraint type
      "chiaveADContestualizzata": {
        // Contextualized AD key for this constraint
        "cdsId": 1,
        "cdsCod": "CDS_AD_1",
        "cdsDes": "Esempio di CDS AD",
        "aaOrdId": 2016,
        "aaOrdCod": "CDS_AD_1",
        "aaOrdDes": "Esempio di CDS AD",
        "pdsId": 1,
        "pdsCod": "PDS_AD_1",
        "pdsDes": "Esempio di PDS AD",
        "aaOffId": 1, // Offer year ID
        "adId": 1, // Teaching activity ID
        "adCod": "PDS_AD_1",
        "adDes": "Esempio di PDS AD",
        "afId": 1 // Teaching load ID
      },
      "annoCorso": 1, // Course year
      "settCod": "123", // Scientific sector code

      // --- OR rules ---
      "regolePropOR": [
        {
          "regpropOrId": 1, // OR rule ID (primary key)
          "regpropVincId": 1, // Parent constraint ID
          "regpropId": 1, // Parent regulation ID
          "des": "123", // OR rule description

          // --- AND rules ---
          "regolePropAND": [
            {
              "regpropAndId": 1, // AND rule ID (primary key)
              "regpropOrId": 1, // Parent OR rule ID
              "regpropVincId": 1, // Parent constraint ID
              "regpropId": 1, // Parent regulation ID
              "tipoVincoloRegola": "NUM_AF", // Rule constraint type
              "numAd": 1, // Number of teaching activities required
              "peso": 5, // Weight
              "raggruppamentoFigli": 1, // Child grouping

              // --- Prerequisite elements ---
              "figli": [
                {
                  "regpropPropId": 1, // Prerequisite element ID (primary key)
                  "regpropAndId": 1, // Parent AND rule ID
                  "tipoElemento": "AC", // Element type
                  "chiaveADContestualizzata": {
                    // Contextualized AD key for this element
                    "cdsId": 1,
                    "cdsCod": "CDS_AD_1",
                    "cdsDes": "Esempio di CDS AD",
                    "aaOrdId": 2016,
                    "aaOrdCod": "CDS_AD_1",
                    "aaOrdDes": "Esempio di CDS AD",
                    "pdsId": 1,
                    "pdsCod": "PDS_AD_1",
                    "pdsDes": "Esempio di PDS AD",
                    "aaOffId": 1,
                    "adId": 1,
                    "adCod": "PDS_AD_1",
                    "adDes": "Esempio di PDS AD",
                    "afId": 1
                  },
                  "annoCorso": 1, // Course year
                  "settCod": "123" // Scientific sector code
                }
              ]
            }
          ]
        }
      ],
      "extId": 1 // Constraint external ID (optional field)
    }
  ]
}
```

<br>

---

<br>

## Endpoints - Compilation Windows (Finestra)

### `GET /regsce/{regsceId}/finestre` - Get compilation windows for a regulation

```java
/**
 * Returns the list of study plan compilation windows associated with a
 * study plan selection regulation, identified by its unique ID.
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @param filter         string (query, optional) - RSQL filter expression applied
 *                                                  after data retrieval
 * @return List<FinestraRegolamentoDiScelta> list of compilation windows for the
 *         regulation, or an empty array if none are defined
 */
GET /regsce/{regsceId}/finestre
```

**Auth:** Public · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
[
  {
    "finregsceId": 1222, // Compilation window ID (primary key)
    "regsceId": 123, // Parent regulation ID
    "tipoFinestra": "string", // Window type
    "dataInizio": "15/10/2015", // Start date (DD/MM/YYYY)
    "dataFine": "15/10/2015", // End date (DD/MM/YYYY)
    "extId": 1 // External ID (optional field)
  }
]
```

<br>

---

<br>

### `GET /regsce/{regsceId}/finestre/{finregsceId}` - Get compilation window by ID

```java
/**
 * Returns a single study plan compilation window identified by its unique ID,
 * scoped to the parent regulation.
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param finregsceId    long   (path, required)  - unique compilation window ID
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @return FinestraRegolamentoDiScelta the compilation window, or 404 if not found
 */
GET /regsce/{regsceId}/finestre/{finregsceId}
```

**Auth:** Public · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
{
  "finregsceId": 1222, // Compilation window ID (primary key)
  "regsceId": 123, // Parent regulation ID
  "tipoFinestra": "string", // Window type
  "dataInizio": "15/10/2015", // Start date (DD/MM/YYYY)
  "dataFine": "15/10/2015", // End date (DD/MM/YYYY)
  "extId": 1 // External ID (optional field)
}
```

<br>

---

<br>

## Endpoints - Plan Schemas (Schema di Piano)

### `GET /regsce/{regsceId}/schemi` - Get plan schemas for a regulation

```java
/**
 * Returns the list of plan schemas associated with a study plan selection
 * regulation, identified by its unique ID.
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @param order          string (query, optional) - sort order; syntax: +/- followed by
 *                                                  field name (+ = ASC, - = DESC);
 *                                                  multiple fields comma-separated
 * @param filter         string (query, optional) - RSQL filter expression applied
 *                                                  after data retrieval
 * @return List<SchemaDiPiano> list of plan schemas for the regulation,
 *         or an empty array if none are defined
 */
GET /regsce/{regsceId}/schemi
```

**Auth:** Public · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
[
  {
    "schemaId": 1, // Schema ID (primary key)
    "schemaCod": "SC_COD", // Schema code, unique within the regulation
    "schemaDes": "Descrizione schema di piano", // Schema description (IT)
    "schemaDesEng": "Descrizione in inglese schema di piano", // Schema description (EN)
    "regsceId": 123, // Parent regulation ID
    "pdsId": 1, // Study path ID
    "pdsCod": "PDS_COD", // Study path code
    "pdsDes": "Descrizione del percorso di studio", // Study path description (optional field)
    "tipoApprovazione": 0, // Approval type
    "gestAnnoCorsoFlg": 0, // Course year management flag (0=no, 1=yes)
    "statutarioFlg": 0, // Statutory flag (0=no, 1=yes)
    "dataInizioVal": "15/10/2015", // Validity start date (DD/MM/YYYY)
    "dataFineVal": "15/10/2015", // Validity end date (DD/MM/YYYY)
    "condId": 123, // SQL condition ID
    "condCod": "COND_COD", // SQL condition code
    "condDes": "Descrizione condizione sql", // SQL condition description (optional field)
    "orientId": 123, // Orientation ID
    "orientCod": "codice dell'orientamento", // Orientation code
    "orientDes": "Descrizione dell'orientamento", // Orientation description (optional field)
    "profCod": "1", // Profile code
    "profDes": "1", // Profile description (optional field)
    "aptId": 123, // Part-time alternative ID
    "aptCod": "PT_50", // Part-time alternative code
    "aptDes": "Part time al 50%", // Part-time alternative description (optional field)
    "webViewFlg": 0 // Public area visibility flag (0=no, 1=yes)
  }
]
```

<br>

---

<br>

### `GET /regsce/{regsceId}/schemi/{schemaId}` - Get plan schema with full details

```java
/**
 * Returns the full detail tree of a single plan schema, identified by its
 * unique ID and scoped to the parent regulation. The response structure
 * follows a nested 1-n hierarchy:
 *
 *   Plan schema
 *   └── Selection rules
 *       ├── Selection blocks
 *       │   ├── Teaching activities
 *       │   │   └── UD rules → modules
 *       │   └── Block conditions
 *       ├── Rule conditions
 *       └── Free OD filters (OR → AND)
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param schemaId       long   (path, required)  - unique schema ID
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @return SchemaDiPianoConDettagli the full schema detail tree, or 404 if not found
 */
GET /regsce/{regsceId}/schemi/{schemaId}
```

**Auth:** Public · Supported: `Basic`, `JWT`

**Cache:** `configuration`

::: tip
The nested structure of `regoleDiScelta` - including `blocchi`, `attivita`, `regoleUD`, `moduli`, `condizioni`, and `filtriOD` - is identical to the one returned by [`GET /regsceFull/{regsceId}`](#get-regscefull-regsceId-get-full-regulation-with-all-details). Refer to that endpoint for the full field-level documentation.
:::

#### Response

**`200 OK`**

```json
{
  "schemaId": 1,                    // Schema ID (primary key)
  "schemaCod": "SC_COD",            // Schema code, unique within the regulation
  "schemaDes": "Descrizione schema di piano",          // Schema description (IT)
  "schemaDesEng": "Descrizione in inglese schema di piano", // Schema description (EN)
  "regsceId": 123,                  // Parent regulation ID
  "pdsId": 1,                       // Study path ID
  "pdsCod": "PDS_COD",              // Study path code
  "pdsDes": "Descrizione del percorso di studio",      // Study path description (optional field)
  "tipoApprovazione": 0,            // Approval type
  "gestAnnoCorsoFlg": 0,            // Course year management flag (0=no, 1=yes)
  "statutarioFlg": 0,               // Statutory flag (0=no, 1=yes)
  "dataInizioVal": "15/10/2015",    // Validity start date (DD/MM/YYYY)
  "dataFineVal": "15/10/2015",      // Validity end date (DD/MM/YYYY)
  "condId": 123,                    // SQL condition ID
  "condCod": "COND_COD",            // SQL condition code
  "condDes": "Descrizione condizione sql",              // SQL condition description (optional field)
  "orientId": 123,                  // Orientation ID
  "orientCod": "codice dell'orientamento",              // Orientation code
  "orientDes": "Descrizione dell'orientamento",         // Orientation description (optional field)
  "profCod": "1",                   // Profile code
  "profDes": "1",                   // Profile description (optional field)
  "aptId": 123,                     // Part-time alternative ID
  "aptCod": "PT_50",                // Part-time alternative code
  "aptDes": "Part time al 50%",     // Part-time alternative description (optional field)
  "webViewFlg": 0,                  // Public area visibility flag (0=no, 1=yes)
  "regoleDiScelta": [ ... ]         // See GET /regsceFull/{regsceId} for full structure
}
```

<br>

---

<br>

## Endpoints - Selection Rules (Regola)

### `GET /regsce/{regsceId}/regole` - Get selection rules for a regulation

```java
/**
 * Returns the list of selection rules associated with a study plan selection
 * regulation, each including the plan schemas linked to that rule.
 * The response follows a 1-n relation between the rule and its schemas.
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @param order          string (query, optional) - sort order; syntax: +/- followed by
 *                                                  field name (+ = ASC, - = DESC);
 *                                                  multiple fields comma-separated
 * @param filter         string (query, optional) - RSQL filter expression applied
 *                                                  after data retrieval
 * @return List<RegolaDiSceltaConSchemi> list of selection rules with their associated
 *         plan schemas, or an empty array if none are defined
 */
GET /regsce/{regsceId}/regole
```

**Auth:** Public · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
[
  {
    "sceltaId": 1234, // Selection rule ID (primary key)
    "regsceId": 123, // Parent regulation ID
    "sceId": 12, // Rule sequence ID
    "ordNum": 12, // Display order
    "des": "Descrizione della regola di scelta", // Rule description (IT)
    "desEng": "Descrizione inglese della regola di scelta", // Rule description (EN)
    "pdsId": 1, // Study path ID
    "pdsCod": "PDS_COD", // Study path code
    "aptId": 123, // Part-time alternative ID
    "aptCod": "PT_50", // Part-time alternative code
    "annoCorso": 1, // Course year
    "annoCorsoAnticipo": 1, // Anticipated course year
    "tipSce": "O", // Rule type code
    "tipSceDes": "regola da Elenco", // Rule type description
    "tipUnt": "CFU", // Unit type (CFU, ORE, etc.)
    "minUnt": 1, // Minimum units required
    "maxUnt": 1, // Maximum units allowed
    "vinId": 1, // Constraint ID
    "livello": 1, // Nesting level
    "modTAF": "A", // TAF mode
    "abilFlg": 0, // Enabled flag (optional field) (0=no, 1=yes)
    "opzFlg": 0, // Optional flag (0=no, 1=yes)
    "sovranFlg": 0, // Sovereign flag (0=no, 1=yes)
    "tesorettoFlg": 0, // Tesoretto flag (0=no, 1=yes)
    "pesoRosaRist": 0, // Rosa restriction weight (optional field)
    "assegnazionePostiFlg": 0, // Seat assignment flag (optional field) (0=no, 1=yes)
    "deliberaFlg": 0, // Deliberation flag (optional field) (0=no, 1=yes)
    "azzeraCfuFlg": 0, // Reset CFU flag (optional field) (0=no, 1=yes)
    "parametriLogisticaFlg": 0, // Logistics parameters flag (optional field) (0=no, 1=yes)
    "notaPre": "nota pre", // Pre-note (IT) (optional field)
    "notaPreEng": "nota pre in inglese", // Pre-note (EN) (optional field)
    "notaPreVisPubblFlg": 0, // Pre-note public visibility (optional field) (0=no, 1=yes)
    "notaPost": "nota post", // Post-note (IT) (optional field)
    "notaPostEng": "nota post in inglese", // Post-note (EN) (optional field)
    "notaPostVisPubblFlg": 0, // Post-note public visibility (optional field) (0=no, 1=yes)
    "extId": 1, // External ID (optional field)
    "extCod": "EXT_COD", // External code (optional field)
    "schemi": [
      // Plan schemas linked to this rule
      {
        "sceltaId": 1, // Parent rule ID (primary key)
        "schemaId": 1, // Schema ID (primary key)
        "schemaCod": "SC_COD", // Schema code
        "ordNum": 2, // Display order of the rule within the schema
        "ptSlotId": 2, // Part-time slot ID
        "ptSlotCod": "PT_COD", // Part-time slot code
        "ptSlotDes": "Descrizione dello slot" // Part-time slot description (optional field)
      }
    ]
  }
]
```

<br>

---

<br>

### `GET /regsce/{regsceId}/regole/{sceltaId}` - Get selection rule with full details

```java
/**
 * Returns the full detail tree of a single selection rule, identified by its
 * unique ID and scoped to the parent regulation. The response extends the base
 * rule with the linked plan schemas and the full block hierarchy:
 *
 *   Selection rule
 *   ├── Plan schemas (linked to this rule)
 *   ├── Selection blocks
 *   │   ├── Teaching activities
 *   │   │   └── UD rules → modules
 *   │   └── Block conditions
 *   ├── Rule conditions
 *   └── Free OD filters (OR → AND)
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param sceltaId       long   (path, required)  - unique selection rule ID
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @return RegolaDiSceltaConDettagli the full rule detail tree, or 404 if not found
 */
GET /regsce/{regsceId}/regole/{sceltaId}
```

**Auth:** Public · Supported: `Basic`, `JWT`

**Cache:** `configuration`

::: tip
The nested structure of `blocchi`, `condizioni`, and `filtriOD` is identical to the one returned by [`GET /regsceFull/{regsceId}`](#get-regscefull-regsceId-get-full-regulation-with-all-details). Refer to that endpoint for the full field-level documentation.
:::

#### Response

**`200 OK`**

```json
{
  "sceltaId": 1234,               // Selection rule ID (primary key)
  "regsceId": 123,                // Parent regulation ID
  "sceId": 12,                    // Rule sequence ID
  "ordNum": 12,                   // Display order
  "des": "Descrizione della regola di scelta",      // Rule description (IT)
  "desEng": "Descrizione inglese della regola di scelta", // Rule description (EN)
  "pdsId": 1,                     // Study path ID
  "pdsCod": "PDS_COD",            // Study path code
  "aptId": 123,                   // Part-time alternative ID
  "aptCod": "PT_50",              // Part-time alternative code
  "annoCorso": 1,                 // Course year
  "annoCorsoAnticipo": 1,         // Anticipated course year
  "tipSce": "O",                  // Rule type code
  "tipSceDes": "regola da Elenco", // Rule type description
  "tipUnt": "CFU",                // Unit type (CFU, ORE, etc.)
  "minUnt": 1,                    // Minimum units required
  "maxUnt": 1,                    // Maximum units allowed
  "vinId": 1,                     // Constraint ID
  "livello": 1,                   // Nesting level
  "modTAF": "A",                  // TAF mode
  "abilFlg": 0,                   // Enabled flag (optional field) (0=no, 1=yes)
  "opzFlg": 0,                    // Optional flag (0=no, 1=yes)
  "sovranFlg": 0,                 // Sovereign flag (0=no, 1=yes)
  "tesorettoFlg": 0,              // Tesoretto flag (0=no, 1=yes)
  "pesoRosaRist": 0,              // Rosa restriction weight (optional field)
  "assegnazionePostiFlg": 0,      // Seat assignment flag (optional field) (0=no, 1=yes)
  "deliberaFlg": 0,               // Deliberation flag (optional field) (0=no, 1=yes)
  "azzeraCfuFlg": 0,              // Reset CFU flag (optional field) (0=no, 1=yes)
  "parametriLogisticaFlg": 0,     // Logistics parameters flag (optional field) (0=no, 1=yes)
  "notaPre": "nota pre",          // Pre-note (IT) (optional field)
  "notaPreEng": "nota pre in inglese",  // Pre-note (EN) (optional field)
  "notaPreVisPubblFlg": 0,        // Pre-note public visibility (optional field) (0=no, 1=yes)
  "notaPost": "nota post",        // Post-note (IT) (optional field)
  "notaPostEng": "nota post in inglese", // Post-note (EN) (optional field)
  "notaPostVisPubblFlg": 0,       // Post-note public visibility (optional field) (0=no, 1=yes)
  "extId": 1,                     // External ID (optional field)
  "extCod": "EXT_COD",            // External code (optional field)
  "schemi": [                     // Plan schemas linked to this rule
    {
      "sceltaId": 1,              // Parent rule ID (primary key)
      "schemaId": 1,              // Schema ID (primary key)
      "schemaCod": "SC_COD",      // Schema code
      "ordNum": 2,                // Display order of the rule within the schema
      "ptSlotId": 2,              // Part-time slot ID
      "ptSlotCod": "PT_COD",      // Part-time slot code
      "ptSlotDes": "Descrizione dello slot" // Part-time slot description (optional field)
    }
  ],
  "blocchi": [ ... ],             // See GET /regsceFull/{regsceId} for full structure
  "condizioni": [ ... ],          // See GET /regsceFull/{regsceId} for full structure
  "filtriOD": [ ... ]             // See GET /regsceFull/{regsceId} for full structure
}
```

<br>

---

<br>

## Endpoints - Study Plans (Piano)

### `PUT /regsce/{regsceId}/piani-collegati/conteggi` - Get linked study plan counts

```java
/**
 * Returns the count of study plans linked to a regulation, broken down by
 * schema, selection rule, teaching activity, and compilation window.
 * Each counter group can be toggled independently via the request body.
 * Optional filters allow scoping the counts to specific elements.
 *
 * @param regsceId            long   (path, required)  - unique regulation ID
 * @param body                object (body, required)  - count toggles and optional filters:
 *   @param conteggiSchemi       boolean - include schema-level counts
 *   @param conteggiRegole       boolean - include rule-level counts
 *   @param conteggiAttivita     boolean - include activity-level counts
 *   @param conteggiFinestre     boolean - include window-level counts
 *   @param filtroSchemaCod      string  - filter counts by schema code
 *   @param filtroRegolaOrdNum   int     - filter counts by rule display order
 *   @param filtroADCod          string  - filter counts by teaching activity code
 *   @param filtroADCdsCod       string  - filter counts by degree course code
 *   @param filtroADAaOrdId      int     - filter counts by curriculum ordering year
 *   @param filtroADPdsCod       string  - filter counts by study path code
 *   @param filtroADAaOffId      int     - filter counts by offer year
 *   @param filtroFinregsceCod   string  - filter counts by compilation window code
 * @param optionalFields      string (query, optional) - list of optional fields to include;
 *                                                       use ALL to return all fields;
 *                                                       supports Ant Glob Patterns
 * @return RegolamentoDiSceltaConConteggi the regulation header with requested count
 *         breakdowns, or 404 if no data is found
 */
PUT /regsce/{regsceId}/piani-collegati/conteggi
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Request body

```json
{
  "conteggiSchemi": true, // Include schema-level counts
  "conteggiRegole": true, // Include rule-level counts
  "conteggiAttivita": true, // Include activity-level counts
  "conteggiFinestre": true, // Include window-level counts
  "filtroSchemaCod": "SC_COD", // Filter by schema code (optional)
  "filtroRegolaOrdNum": 1, // Filter by rule display order (optional)
  "filtroADCod": "AD_1", // Filter by teaching activity code (optional)
  "filtroADCdsCod": "CDS_1", // Filter by degree course code (optional)
  "filtroADAaOrdId": 2025, // Filter by curriculum ordering year (optional)
  "filtroADPdsCod": "PDS_1", // Filter by study path code (optional)
  "filtroADAaOffId": 2025, // Filter by offer year (optional)
  "filtroFinregsceCod": "FIN_COD_1" // Filter by compilation window code (optional)
}
```

#### Response

**`200 OK`**

```json
{
  "regsceId": 123, // Regulation ID (primary key)
  "facId": 123, // Faculty ID
  "facCod": "123", // Faculty code
  "tipoCorsoCod": "123", // Course type code
  "cdsId": 123, // Degree course ID
  "cdsCod": "123", // Degree course code
  "cdsDes": "123", // Degree course description
  "aaOrdId": 123, // Curriculum ordering year
  "coorte": 2012, // Student cohort year
  "aaRevisioneId": 2012, // Revision year
  "stato": "A", // Regulation status (A=active, B=draft, X=cancelled)
  "dataUltimaModifica": "15/10/2015", // Last modification date (DD/MM/YYYY) (optional field)
  "dataInserimento": "15/10/2015", // Insertion date (DD/MM/YYYY) (optional field)
  "schemi": [
    // Schema-level counts (optional field)
    {
      "schemaCod": "COD_1", // Schema code
      "schemaDes": "Schema di esempio", // Schema description
      "schemaId": 1, // Schema ID
      "conteggio": 3 // Number of linked study plans
    }
  ],
  "regole": [
    // Rule-level counts (optional field)
    {
      "ordNum": 1, // Rule display order
      "sceltaId": 1, // Selection rule ID
      "sceId": 1, // Rule sequence ID
      "sceDes": "Insegnamenti obbligatori", // Rule description
      "tipSce": "O", // Rule type code
      "tipSceDes": "Obbligatorio", // Rule type description
      "conteggio": 10 // Number of linked study plans
    }
  ],
  "attivita": [
    // Activity-level counts (optional field)
    {
      "cdsAdCod": "CDS_1", // Degree course code for the activity
      "cdsAdDes": "Matematica", // Degree course description for the activity
      "aaOrdAdId": 2025, // Curriculum ordering year for the activity
      "aaOffAdId": 2025, // Offer year for the activity
      "pdsAdCod": "PDS_1", // Study path code for the activity
      "pdsAdDes": "Comune", // Study path description for the activity
      "adCod": "AD_1", // Teaching activity code
      "adDes": "Matematica", // Teaching activity description
      "sceltaAdId": 1, // Activity entry ID
      "sceId": 1, // Parent rule sequence ID
      "blkId": 1, // Parent block ID
      "conteggio": 1 // Number of linked study plans
    }
  ],
  "finestre": [
    // Window-level counts (optional field)
    {
      "finregsceCod": "FIN_COD_1", // Compilation window code
      "finregsceDes": "Finestra 1", // Compilation window description
      "finregsceId": 1, // Compilation window ID
      "conteggio": 1 // Number of linked study plans
    }
  ]
}
```

**`404 Not Found`**

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

### `GET /regsce/{regsceId}/piani/stats` - Get study plan statistics for a regulation

```java
/**
 * Returns aggregate statistics on the study plans linked to a study plan
 * selection regulation, identified by its unique ID.
 *
 * @param regsceId long (path, required) - unique regulation ID
 * @return StatsPiani an object with the total plan count broken down by type,
 *         or 404 if not found
 */
GET /regsce/{regsceId}/piani/stats
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
{
  "numPianiStandardValidi": 11, // Number of valid standard study plans
  "numPianiIndividualiValidi": 12, // Number of valid individual study plans
  "numPiani": 13 // Total number of linked study plans
}
```

<br>

---

<br>

### `GET /regsce/{regsceId}/regole/{sceltaId}/AD/{sceltaAdId}/piani` - Get study plans linked to a rule activity

```java
/**
 * Returns the list of study plans that include a specific teaching activity
 * within a selection rule, scoped to the parent regulation. Results can be
 * filtered by plan status and support pagination.
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param sceltaId       long   (path, required)  - unique selection rule ID
 * @param sceltaAdId     long   (path, required)  - unique activity entry ID within the rule
 * @param statiPiano     string (query, optional) - plan status filter; comma-separated;
 *                                                  defaults to A,P,V if not provided
 * @param start          int    (query, optional) - index of the first record to load,
 *                                                  defaults to 0
 * @param limit          int    (query, optional) - number of records to retrieve starting
 *                                                  from start, defaults to 50,
 *                                                  allowed range: 0–100
 * @param order          string (query, optional) - sort order; syntax: +/- followed by
 *                                                  field name (+ = ASC, - = DESC);
 *                                                  multiple fields comma-separated
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @return List<TestataPianoDiStudioPerAD> paginated list of study plan headers linked
 *         to the activity, or an empty array if none match
 */
GET /regsce/{regsceId}/regole/{sceltaId}/AD/{sceltaAdId}/piani
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
[
  {
    "stuId": 123, // Student ID (primary key)
    "pianoId": 1, // Study plan ID (primary key)
    "staStuCod": "A", // Student status code (optional field)
    "motStastuCod": "ATT", // Student status reason code (optional field)
    "staMatCod": "A", // Enrollment status code (optional field)
    "motStamatCod": "IMM", // Enrollment status reason code (optional field)
    "matId": 123, // Enrollment ID
    "regsceId": 122, // Parent regulation ID
    "schemaId": 122, // Plan schema ID
    "finregsceId": 122, // Compilation window ID (optional field)
    "stato": "A", // Plan status
    "statoDes": "string", // Plan status description
    "dataUltimaVarStato": "15/10/2015", // Last status change date (DD/MM/YYYY)
    "tipoPiano": "I", // Plan type (I=individual, S=standard)
    "statutarioFlg": 0, // Statutory flag (0=no, 1=yes)
    "coorte": 2012, // Student cohort year (optional field)
    "aaRevisioneId": 2012, // Revision year (optional field)
    "cdsStuId": 1223, // Student's degree course ID
    "cdsStuCod": "GEN", // Student's degree course code
    "cdsStuDes": "percorso generico", // Student's degree course description (optional field)
    "aaOrdStuId": 1223, // Student's curriculum ordering year
    "pdsStuId": 123, // Student's study path ID (optional field)
    "pdsStuCod": "GEN", // Student's study path code
    "pdsDes": "percorso generico", // Student's study path description (optional field)
    "pdsSceId": 123, // Selection study path ID (optional field)
    "pdsSceCod": "GEN", // Selection study path code
    "pdsSceDes": "percorso generico", // Selection study path description (optional field)
    "aaDefId": 2012, // Definition academic year
    "aaIscrId": 2012, // Enrollment academic year (optional field)
    "aptId": 122, // Part-time alternative ID
    "aptCod": "B2", // Part-time alternative code
    "aptDes": "Part Time al 50%", // Part-time alternative description (optional field)
    "aaUltimaAttuazioneId": 2012, // Last activation academic year
    "dataUltimaAttuazione": "15/10/2015", // Last activation date (DD/MM/YYYY)
    "userUltimaAttuazione": "m.rossi", // Last activation user
    "userControllo": "m.rossi", // Review user
    "notaControllo": "per approvare il piano occorre sostituire l'attività X con l'attività Y", // Review note
    "noteSistema": "Annullamento massivo per attivazione piani approvati", // System notes
    "noteUtente": "note libere", // User notes
    "extCod": "per approvare il piano occorre sostituire l'attività X con l'attività Y", // External code (optional field)
    "sceltaId": 1234, // Selection rule ID (optional field)
    "sceltaAdId": 0 // Activity entry ID (optional field)
  }
]
```

<br>

---

<br>

### `GET /regsce/{regsceId}/regole/{sceltaId}/piani` - Get study plans linked to a selection rule

```java
/**
 * Returns the list of study plans linked to a specific selection rule,
 * scoped to the parent regulation. Results can be filtered by plan status
 * and support pagination.
 *
 * @param regsceId       long   (path, required)  - unique regulation ID
 * @param sceltaId       long   (path, required)  - unique selection rule ID
 * @param statiPiano     string (query, optional) - plan status filter; comma-separated;
 *                                                  defaults to A,P,V if not provided
 * @param start          int    (query, optional) - index of the first record to load,
 *                                                  defaults to 0
 * @param limit          int    (query, optional) - number of records to retrieve starting
 *                                                  from start, defaults to 50,
 *                                                  allowed range: 0–100
 * @param order          string (query, optional) - sort order; syntax: +/- followed by
 *                                                  field name (+ = ASC, - = DESC);
 *                                                  multiple fields comma-separated
 * @param fields         string (query, optional) - list of optional fields to include;
 *                                                  use ALL to return all fields;
 *                                                  supports Ant Glob Patterns
 * @param optionalFields string (query, optional) - alias for fields; same behavior
 * @return List<TestataPianoDiStudioPerRegola> paginated list of study plan headers
 *         linked to the rule, or an empty array if none match
 */
GET /regsce/{regsceId}/regole/{sceltaId}/piani
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
[
  {
    "stuId": 123, // Student ID (primary key)
    "pianoId": 1, // Study plan ID (primary key)
    "staStuCod": "A", // Student status code (optional field)
    "motStastuCod": "ATT", // Student status reason code (optional field)
    "staMatCod": "A", // Enrollment status code (optional field)
    "motStamatCod": "IMM", // Enrollment status reason code (optional field)
    "matId": 123, // Enrollment ID
    "regsceId": 122, // Parent regulation ID
    "schemaId": 122, // Plan schema ID
    "finregsceId": 122, // Compilation window ID (optional field)
    "stato": "A", // Plan status
    "statoDes": "string", // Plan status description
    "dataUltimaVarStato": "15/10/2015", // Last status change date (DD/MM/YYYY)
    "tipoPiano": "I", // Plan type (I=individual, S=standard)
    "statutarioFlg": 0, // Statutory flag (0=no, 1=yes)
    "coorte": 2012, // Student cohort year (optional field)
    "aaRevisioneId": 2012, // Revision year (optional field)
    "cdsStuId": 1223, // Student's degree course ID
    "cdsStuCod": "GEN", // Student's degree course code
    "cdsStuDes": "percorso generico", // Student's degree course description (optional field)
    "aaOrdStuId": 1223, // Student's curriculum ordering year
    "pdsStuId": 123, // Student's study path ID (optional field)
    "pdsStuCod": "GEN", // Student's study path code
    "pdsDes": "percorso generico", // Student's study path description (optional field)
    "pdsSceId": 123, // Selection study path ID (optional field)
    "pdsSceCod": "GEN", // Selection study path code
    "pdsSceDes": "percorso generico", // Selection study path description (optional field)
    "aaDefId": 2012, // Definition academic year
    "aaIscrId": 2012, // Enrollment academic year (optional field)
    "aptId": 122, // Part-time alternative ID
    "aptCod": "B2", // Part-time alternative code
    "aptDes": "Part Time al 50%", // Part-time alternative description (optional field)
    "aaUltimaAttuazioneId": 2012, // Last activation academic year
    "dataUltimaAttuazione": "15/10/2015", // Last activation date (DD/MM/YYYY)
    "userUltimaAttuazione": "m.rossi", // Last activation user
    "userControllo": "m.rossi", // Review user
    "notaControllo": "per approvare il piano occorre sostituire l'attività X con l'attività Y", // Review note
    "noteSistema": "Annullamento massivo per attivazione piani approvati", // System notes
    "noteUtente": "note libere", // User notes
    "extCod": "per approvare il piano occorre sostituire l'attività X con l'attività Y", // External code (optional field)
    "sceltaId": 1234 // Selection rule ID (optional field)
  }
]
```

<br>

---

<br>

### `GET /regsce/{regsceId}/regole/{sceltaId}/piani/stats` - Get study plan statistics for a selection rule

```java
/**
 * Returns aggregate statistics on the study plans linked to a specific
 * selection rule, scoped to the parent regulation.
 *
 * @param regsceId long (path, required) - unique regulation ID
 * @param sceltaId long (path, required) - unique selection rule ID
 * @return StatsPiani an object with the total plan count broken down by type,
 *         or 404 if not found
 */
GET /regsce/{regsceId}/regole/{sceltaId}/piani/stats
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
{
  "numPianiStandardValidi": 11, // Number of valid standard study plans
  "numPianiIndividualiValidi": 12, // Number of valid individual study plans
  "numPiani": 13 // Total number of linked study plans
}
```

<br>

---

<br>

### `GET /regsce/{regsceId}/schemi/{schemaId}/piani/stats` - Get study plan statistics for a plan schema

```java
/**
 * Returns aggregate statistics on the study plans linked to a specific
 * plan schema, scoped to the parent regulation.
 *
 * @param regsceId long (path, required) - unique regulation ID
 * @param schemaId long (path, required) - unique schema ID
 * @return StatsPiani an object with the total plan count broken down by type,
 *         or 404 if not found
 */
GET /regsce/{regsceId}/schemi/{schemaId}/piani/stats
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration`

#### Response

**`200 OK`**

```json
{
  "numPianiStandardValidi": 11, // Number of valid standard study plans
  "numPianiIndividualiValidi": 12, // Number of valid individual study plans
  "numPiani": 13 // Total number of linked study plans
}
```

<br>

---

<br>

---

## References

- **Swagger UI:** [Regsce Api V1 - ESSE3 REST Docs](<https://unimol.esse3.cineca.it/e3rest/docs/?urls.primaryName=Regsce%20Api%20V1%20(https%3A%2F%2Funimol.esse3.cineca.it%2Fe3rest%2Fapi%2Fregsce-service-v1)#/>)
- **Spec YAML:** [p08-regsceApiV1.yaml](https://unimol.esse3.cineca.it/e3rest/api/swagger-service-v1/swagger/specs/p08-regsceApiV1.yaml)
- **ESSE3 REST API General Documentation:** [wiki.u-gov.it](https://wiki.u-gov.it/confluence/display/ESSE3/Servizi+REST+su+ESSE3)

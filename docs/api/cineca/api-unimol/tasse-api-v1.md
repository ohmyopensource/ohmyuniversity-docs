---
title: Tasse API V1 | OhMyUniversity!
description: REST API documentation for the Tasse service (tasse-service-v1) - fees, payments, refunds, invoices, exemptions, and scholarships in CINECA ESSE3.
head:
  - - meta
    - property: og:title
      content: Tasse API V1 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Tasse service (tasse-service-v1) - fees, payments, refunds, invoices, exemptions, and scholarships in CINECA ESSE3.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/cineca/api-unimol/tasse-api-v1
  - - meta
    - name: keywords
      content: tasse api, fees api, esse3 rest api, cineca api, ohmyuniversity api, addebiti, fatture, pagamenti, rimborsi, esoneri, borse di studio, semaforo tasse
  - - meta
    - name: twitter:title
      content: Tasse API V1 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Tasse service (tasse-service-v1) - fees, payments, refunds, invoices, exemptions, and scholarships in CINECA ESSE3.
---

# OhMyUniversity! - Unimol: Tasse API V1

**ENG:** `Fees`

**Version:** `1.4.0` · **Base URL:** `/tasse-service-v1`

REST API for managing student fees in ESSE3, covering charges, invoices, payments, refunds, exemptions, scholarships, and PagoPA integrations.

---

## Changelog

| Version | ESSE3 Release | Changes                                                                                                          |
| ------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 19.12.00.00   | Added `/addebiti-persona/{persId}`, `/semaforo/{stuId}`, `/lista-pagamenti/{persId}`, `/lista-rimborsi/{persId}` |
| 1.0.0   | 21.03.01.00   | Added `/esoneri-anno-accademico/{aaId}`, `/lista-esoneri-studente`                                               |
| 1.1.0   | 19.12.01.00   | Added `/parametri-iscrizioni-per-tasse/{stuId}`                                                                  |
| 1.1.0   | 21.03.01.00   | Changed `/addebiti-studente/{stuId}` > `/addebiti-studente`                                                      |
| 1.2.0   | 20.05.04.00   | Changed `/lista-fatture/{persId}` > `/lista-fatture`                                                             |
| 1.2.0   | 21.02.03.00   | Added `/allegati/{fattId}/allegatiFattura/`                                                                      |
| 1.4.0   | 21.06.02.00   | Added `optionalFields` parameter to `/addebiti-studente`                                                         |
| 1.5.0   | 21.11.00.00   | Added `/autocert/{persId}/annoAcc/{aaId}`                                                                        |
| 1.6.0   | 22.03.02.00   | Added `/incassi/inserisciIncasso`                                                                                |
| 1.7.0   | 22.04.03.00   | Added `/adisurc/datiMerito/{codFis}/annoIscr/{aaIscrId}`                                                         |
| 1.7.1   | 22.06.01.00   | Added `/annullaFattura/{fattId}/tipoAnnullamento/{tipoAnnullamento}`                                             |

---

## Endpoints - Scholarships (Borse di Studio)

### `POST /acqDomandeEsitiBorse` - Import regional scholarship outcomes

```java
/**
 * Imports the outcomes of regional scholarship applications into ESSE3.
 * Each entry in the datiBorse array is processed individually — entries
 * that fail validation are returned in the errori field of the response
 * without blocking the rest of the batch.
 *
 * @param body object (body, required) - import payload containing:
 *               - annoAccademico int   - academic year
 *               - tipoRichiesta  int   - request type
 *               - datiBorse      array - list of scholarship outcome entries,
 *                                        each identified by codFis or matricola
 * @return List<DatiEsitoBorsaResponse> result per entry with the original
 *         data and any validation errors, or 422 if parameters are invalid
 */
POST /acqDomandeEsitiBorse
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "annoAccademico": 2022, // Academic year
  "tipoRichiesta": 1, // Request type
  "datiBorse": [
    {
      "codFis": "string", // Student fiscal code
      "cognome": "string", // Last name
      "nome": "string", // First name
      "matricola": "string", // Student ID number
      "cdsCod": "CDS5", // Degree course code
      "cdsDes": "string", // Degree course description
      "facCod": "DEPF", // Faculty code
      "tipoIscr": "F", // Enrollment type
      "dataDomanda": "string", // Application date (dd/MM/yyyy hh:mm:ss)
      "esito": "E" // Outcome code
    }
  ]
}
```

#### Response

**`201 Created`**

```json
[
  {
    "datiEsitoBorsa": {
      // Original entry data echoed back
      "codFis": "string", // Student fiscal code
      "cognome": "string", // Last name
      "nome": "string", // First name
      "matricola": "string", // Student ID number
      "cdsCod": "CDS5", // Degree course code
      "cdsDes": "string", // Degree course description
      "facCod": "DEPF", // Faculty code
      "tipoIscr": "F", // Enrollment type
      "dataDomanda": "string", // Application date (dd/MM/yyyy hh:mm:ss)
      "esito": "E" // Outcome code
    },
    "errori": [
      // Validation errors for this entry (empty if ok)
      {
        "errore": "string" // Error message
      }
    ]
  }
]
```

**`422 Unprocessable Entity`** — invalid parameters

```json
{
  "statusCode": 200,
  "retCode": -1,
  "retErrMsg": "Parametri non corretti",
  "errDetails": [
    {
      "errorType": "stackTrace", // Error type
      "value": "string", // Error message
      "rawValue": "string" // Raw error (JSON)
    }
  ]
}
```

<br>

---

<br>

### `GET /adisurc/datiMerito/{codFis}/annoIscr/{aaIscrId}` - Get Adisurc merit data

```java
/**
 * Returns the merit requirements defined by Adisurc for processing
 * scholarship rankings, for a specific student identified by fiscal code
 * and enrollment year.
 *
 * @param codFis   string (path, required) - student fiscal code
 * @param aaIscrId long   (path, required) - enrollment year ID
 * @return DatiMeritoAdisurc student registry and career merit data,
 *         or 422 if parameters are invalid
 */
GET /adisurc/datiMerito/{codFis}/annoIscr/{aaIscrId}
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration` — configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
{
  "codFis": "string", // Student fiscal code
  "cognome": "string", // Last name
  "nome": "string", // First name
  "dataNascita": "string", // Date of birth (dd/MM/yyyy)
  "stuIscr": [
    {
      "iscrReg": "N", // Regular enrollment flag
      "idTipoLaurea": "N", // Degree type ID
      "corsoSpecObb": "N", // Mandatory specialization course flag
      "corsoSpecMed": "N", // Medical specialization course flag
      "dottBorsa": "N", // PhD scholarship flag
      "dipDes": "string", // Department description
      "cdsCod": "L31", // Degree course code
      "cdsDes": "string", // Degree course description
      "cdsClasseCod": "L-81", // Degree class code
      "cdsClasseDes": "string", // Degree class description
      "comuneSedeDes": "string", // Municipality of the institution
      "comuneSedeBelfioreCod": "string", // Belfiore code of the municipality
      "matricola": "string", // Student ID number
      "annoCorso": 2022, // Current course year
      "staIscrCod": "A", // Enrollment status code
      "tipoIscrCod": "IC", // Enrollment type code
      "anniFc": 1, // Out-of-course years
      "aaPrimaIscr": 2019, // First enrollment academic year
      "staMatCod": "A", // Enrollment record status code
      "motStamatCod": "string", // Enrollment record status reason code
      "staStuCod": "A", // Career status code
      "motStaStuCod": "string", // Career status reason code
      "aaInizioCarriera": 2019, // Career start academic year
      "aaFineCarriera": 2022, // Career end academic year
      "dataChiusuraCarriera": "string", // Career closure date (dd/MM/yyyy)
      "dataConsTit": "string", // Degree award date (dd/MM/yyyy)
      "laureatoNeiTermini": "S", // Graduated on time flag (S/N)
      "durataCorso": 1, // Course duration in years

      // CFU and grade metrics (DR1)
      "nCfuDr1": 213, // CFU count DR1
      "mediaPesataDr1": 27.18, // Weighted average DR1
      "nCfuConvDr1": 180, // Recognized CFU DR1
      "aaCfuConvDr1": 2018, // CFU recognition academic year DR1
      "tcCfuConvDr1": "N", // Transferred CFU DR1 flag

      // CFU counts (DR2-DR4)
      "nCfuDr2": 213, // CFU count DR2
      "nCfuDr3": 213, // CFU count DR3
      "nCfuDr4": 213, // CFU count DR4

      // Equivalent degree info
      "aaConsTitEq": 2018, // Equivalent degree award academic year
      "tipoTitMiurEq": "N", // MIUR equivalent degree type
      "titEqConsInAte": "N", // Equivalent degree awarded at this institution flag
      "aaConsTit": 2018, // Degree award academic year

      // Additional flags
      "iscrCorsoFit": "N", // Enrolled in FIT course flag
      "iscrCorsoStem": "N", // Enrolled in STEM course flag
      "bandoMobint": "N", // International mobility scholarship flag
      "variazioneCarriera": "N" // Career change flag
    }
  ]
}
```

**`422 Unprocessable Entity`** — invalid parameters

```json
{
  "statusCode": 200,
  "retCode": -1,
  "retErrMsg": "Parametri non corretti",
  "errDetails": [
    {
      "errorType": "stackTrace", // Error type
      "value": "string", // Error message
      "rawValue": "string" // Raw error (JSON)
    }
  ]
}
```

<br>

---

<br>

## Endpoints - Fee Waivers (Esoneri)

### `POST /acqEsoneri` - Assign exemptions to students

```java
/**
 * Assigns one or more exemptions to students. Each entry in the array is
 * processed individually — entries that fail validation are returned in the
 * errori field of the response without blocking the rest of the batch.
 *
 * @param body array (body, required) - list of exemption entries, each containing
 *                                       student identification and exemption data
 * @return List<DatiEsoneroResponse> result per entry with the original data
 *         and any validation errors, or 422 if parameters are invalid
 */
POST /acqEsoneri
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
[
  {
    "annoAccademico": 2022, // Academic year
    "codFis": "string", // Student fiscal code
    "matricola": "string", // Student ID number
    "stuId": 1234, // Student career ID
    "cdsCod": "CDS5", // Degree course code
    "facCod": "DEPF", // Faculty code
    "esonero": "ENTI-EST", // Exemption code
    "causaleEsonero": "ESO_P_BDS" // Exemption reason code
  }
]
```

#### Response

**`201 Created`**

```json
[
  {
    "datiEsonero": {
      // Original entry data echoed back
      "annoAccademico": 2022, // Academic year
      "codFis": "string", // Student fiscal code
      "matricola": "string", // Student ID number
      "stuId": 1234, // Student career ID
      "cdsCod": "CDS5", // Degree course code
      "facCod": "DEPF", // Faculty code
      "esonero": "ENTI-EST", // Exemption code
      "causaleEsonero": "ESO_P_BDS" // Exemption reason code
    },
    "errori": [
      // Validation errors for this entry (empty if ok)
      {
        "errore": "string" // Error message
      }
    ]
  }
]
```

**`422 Unprocessable Entity`** — invalid parameters

```json
{
  "statusCode": 200,
  "retCode": -1,
  "retErrMsg": "Parametri non corretti",
  "errDetails": [
    {
      "errorType": "stackTrace", // Error type
      "value": "string", // Error message
      "rawValue": "string" // Raw error (JSON)
    }
  ]
}
```

<br>

---

<br>

### `PUT /esoneri/respingi` - Reject student exemption

```java
/**
 * Rejects an exemption application submitted by a student.
 *
 * @param body object (body, required) - rejection data containing student
 *                                       identification, exemption code,
 *                                       and rejection reason
 * @return 200 if rejection succeeded, 422 if parameters are invalid
 */
PUT /esoneri/respingi
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "annoAccademico": 2022, // Academic year
  "codFis": "string", // Student fiscal code
  "matricola": "string", // Student ID number
  "stuId": 1234, // Student career ID
  "cdsCod": "CDS5", // Degree course code
  "facCod": "DEPF", // Faculty code
  "esonero": "ENTI-EST", // Exemption code to reject
  "motivazione": "string" // Rejection reason
}
```

#### Response

**`200 OK`** — rejection succeeded, no body returned

**`422 Unprocessable Entity`** — invalid parameters

```json
{
  "statusCode": 200,
  "retCode": -1,
  "retErrMsg": "Parametri non corretti",
  "errDetails": [
    {
      "errorType": "stackTrace", // Error type
      "value": "string", // Error message
      "rawValue": "string" // Raw error (JSON)
    }
  ]
}
```

<br>

---

<br>

## Endpoints - Fees (Tasse)

### `GET /addebiti-persona/{persId}` - Get charges by person

```java
/**
 * Returns all charges linked to a person ID, including both admission fees
 * and service fees associated with the person.
 *
 * @param persId      long   (path, required)  - unique person ID
 * @param aaId        long   (query, optional) - academic year ID
 * @param fattId      long   (query, optional) - invoice ID
 * @param pagatoFlg   int    (query, optional) - payment status filter;
 *                                               1=paid only, 0=unpaid only,
 *                                               null=all
 * @param annullataFlg int   (query, optional) - cancellation status filter;
 *                                               1=cancelled only, 0=not cancelled
 *                                               (default: 0)
 * @param start       int    (query, optional) - index of the first record to load,
 *                                               defaults to 0
 * @param limit       int    (query, optional) - number of records to retrieve
 *                                               starting from start, defaults
 *                                               to 50, allowed range: 0–100
 * @param order       string (query, optional) - sort order; prefix + (ASC) or -
 *                                               (DESC) followed by field name;
 *                                               multiple fields comma-separated
 *                                               (e.g. +aaId,-scadenzaAddebito)
 * @return List<AddebitoPersona> paginated list of charges for the person,
 *         or an empty array if none match
 */
GET /addebiti-persona/{persId}
```

**Auth:** `UserTecnicoMassivo` · `PERSONA` · `STUDENTE` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `highRefreshRateUserIndependent` — high-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    // Person and charge info
    "persId": 5321, // Person ID
    "nome": "Antonio", // First name
    "cognome": "Rossi", // Last name
    "codFis": "string", // Fiscal code
    "aaId": 2019, // Academic year ID
    "tipoAd": "STU", // Charge type
    "tassaId": 65874, // Fee ID
    "tipoTaxCod": "ISCR", // Fee type code
    "tassaCod": "CONC", // Fee code
    "tassaDes": "string", // Fee description

    // Combination and voice
    "combId": 74, // Combination ID
    "combCod": "string", // Combination code
    "combDes": "string", // Combination description
    "tipoVoceCod": "string", // Voice type code
    "voceId": 9874, // Voice ID
    "voceCod": "string", // Voice code
    "voceDes": "string", // Voice description

    // Installment
    "rataId": 2468, // Installment ID
    "rataDes": "string", // Installment description
    "importoVoce": 100.2, // Charge amount
    "scadenzaAddebito": "string", // Charge due date (dd/MM/yyyy)
    "scadutoFlg": 0, // Expired flag (1=yes, 0=no)

    // Invoice
    "fattId": 125478, // Invoice ID
    "fattCod": "string", // Invoice code
    "scadFattura": "string", // Invoice due date (dd/MM/yyyy)
    "fattScadutaFlg": 0, // Invoice expired flag (1=yes, 0=no)
    "importoFattura": "string", // Invoice amount
    "dataEmissione": "string", // Issue date (dd/MM/yyyy)
    "dataElab": "string", // Processing date (dd/MM/yyyy)
    "fattErrataId": 895623, // Erroneous invoice ID
    "fattAnnullata": 0, // Invoice cancelled flag (1=yes, 0=no)
    "fattMoraId": 123456, // Late fee invoice ID
    "moraAddFlg": 0, // Late fee added flag (1=yes, 0=no)
    "moraCount": 1, // Late fee count
    "desMav1": "string", // MAV description line 1
    "desMav2": "string", // MAV description line 2
    "numeroMav": "string", // MAV number
    "visWebFlg": 0, // Visible on web flag (1=yes, 0=no)

    // Payment
    "pagId": 85213, // Payment ID
    "importoPag": "string", // Payment amount
    "pagatoFlg": 0, // Paid flag (1=yes, 0=no)
    "dataPagamento": "string", // Payment date (dd/MM/yyyy)
    "dataNotifica": "string", // Notification date (dd/MM/yyyy)
    "dataAccredito": "string", // Credit date (dd/MM/yyyy)
    "incassatoDa": "MAV", // Collected via (e.g. MAV)
    "iuv": "string", // Unique payment identifier (IUV)
    "codiceAvviso": "string", // PagoPA notice code
    "iur": "string", // Unique collection identifier (IUR)
    "nBollettino": "string", // Bulletin number
    "rendicontoId": 456987123, // Accounting report ID
    "regManFlg": 0, // Manual registration flag (1=yes, 0=no)
    "paDtVersamento": "string", // PA payment load date (dd/MM/yyyy)

    // Cancellation and refund
    "annullataFlg": 0, // Cancelled flag (1=yes, 0=no)
    "tipoRimbPagCod": "MAV", // Refund/payment type code
    "rimborsatoFlg": 0, // Refunded flag (1=yes, 0=no)
    "notaRimb": "string", // Refund note
    "codElabRimb": "string", // Refund processing code
    "numMandatoRimb": "string", // Refund mandate number
    "cauRimbCod": "string", // Refund reason code

    // No further charges
    "noAddebMoreFlg": 0, // No further charges flag (1=yes, 0=no)
    "noAddebMoreData": "string", // No further charges date (dd/MM/yyyy)
    "noAddebMoreNota": "string", // No further charges note
    "noAddebMoreUsrId": "string", // No further charges set by user

    // Notes
    "note": "string", // Note
    "notaCalcolo": "string" // Calculation note
  }
]
```

**`422 Unprocessable Entity`** — invalid parameters

```json
{
  "statusCode": 200,
  "retCode": -1,
  "retErrMsg": "Parametri non corretti",
  "errDetails": [
    {
      "errorType": "stackTrace", // Error type
      "value": "string", // Error message
      "rawValue": "string" // Raw error (JSON)
    }
  ]
}
```

<br>

---

<br>

### `GET /addebiti-studente` - Get charges by student

```java
/**
 * Returns all charges for a student, including student fees, admission fees,
 * and service fees linked to the person. Student can be identified via stuId
 * or extStuCod.
 *
 * @param stuId        long   (query, optional) - unique student ID
 * @param extStuCod    string (query, optional) - student code from external archive
 * @param aaId         long   (query, optional) - academic year ID
 * @param fattId       long   (query, optional) - invoice ID
 * @param scadFattura  string (query, optional) - invoice due date
 * @param rataId       long   (query, optional) - installment ID
 * @param tipoTaxCod   string (query, optional) - fee type code
 * @param tassaCod     string (query, optional) - fee code
 * @param scadutoFlg   int    (query, optional) - expiry status filter;
 *                                                1=expired only, 0=not expired,
 *                                                null=all
 * @param pagatoFlg    int    (query, optional) - payment status filter;
 *                                                1=paid only, 0=unpaid only,
 *                                                null=all
 * @param annullataFlg int    (query, optional) - cancellation status filter;
 *                                                1=cancelled only, 0=not cancelled
 *                                                (default: 0)
 * @param optionalFields string (query, optional) - comma-separated list of optional
 *                                                   fields to include; use ALL for
 *                                                   all fields; supports Ant Glob
 *                                                   Patterns (e.g. childObj.prop1,
 *                                                   childObj.*, childObj.**)
 * @param start        int    (query, optional) - index of the first record to load,
 *                                                defaults to 0
 * @param limit        int    (query, optional) - number of records to retrieve
 *                                                starting from start, defaults
 *                                                to 50, allowed range: 0–100
 * @param order        string (query, optional) - sort order; prefix + (ASC) or -
 *                                                (DESC) followed by field name;
 *                                                multiple fields comma-separated
 *                                                (e.g. +aaId,-scadenzaAddebito)
 * @return List<AddebitoStudente> paginated list of charges for the student,
 *         or an empty array if none match
 */
GET /addebiti-studente
```

**Auth:** `UserTecnicoMassivo` · `STUDENTE` · `IMMATRICOLATI_IN_IPOTESI` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `configuration` — configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    // Student info
    "stuId": 1235, // Student career ID
    "matricola": "string", // Student ID number
    "persId": 5321, // Person ID
    "nome": "Antonio", // First name
    "cognome": "Rossi", // Last name
    "codFis": "string", // Fiscal code
    "emailAte": "string", // Institutional email
    "semaforo": "ROSSO", // Fee traffic light status
    "dovuto": 100, // Total amount due

    // Charge info
    "aaId": 2019, // Academic year ID
    "tipoAd": "STU", // Charge type
    "tassaId": 65874, // Fee ID
    "tipoTaxCod": "ISCR", // Fee type code
    "tassaCod": "CONC", // Fee code
    "tassaDes": "string", // Fee description

    // Combination and voice
    "combId": 74, // Combination ID
    "combCod": "string", // Combination code
    "combDes": "string", // Combination description
    "tipoVoceCod": "string", // Voice type code
    "voceId": 9874, // Voice ID
    "voceCod": "string", // Voice code
    "voceDes": "string", // Voice description

    // Installment
    "rataId": 2468, // Installment ID
    "rataDes": "string", // Installment description
    "importoVoce": 100.2, // Charge amount
    "scadenzaAddebito": "string", // Charge due date (dd/MM/yyyy)
    "scadutoFlg": 0, // Expired flag (1=yes, 0=no)

    // Invoice
    "fattId": 125478, // Invoice ID
    "fattCod": "string", // Invoice code
    "fattContab": 1, // Accounting invoice flag (optional field)
    "fattConguaglioId": 123456, // Adjustment invoice ID
    "scadFattura": "string", // Invoice due date (dd/MM/yyyy)
    "fattScadutaFlg": 0, // Invoice expired flag (1=yes, 0=no)
    "importoFattura": "string", // Invoice amount
    "dataEmissione": "string", // Issue date (dd/MM/yyyy)
    "dataElab": "string", // Processing date (dd/MM/yyyy)
    "fattErrataId": 895623, // Erroneous invoice ID
    "fattAnnullata": 0, // Invoice cancelled flag (1=yes, 0=no)
    "fattMoraId": 123456, // Late fee invoice ID
    "moraAddFlg": 0, // Late fee added flag (1=yes, 0=no)
    "moraCount": 1, // Late fee count
    "desMav1": "string", // MAV description line 1
    "desMav2": "string", // MAV description line 2
    "numeroMav": "string", // MAV number
    "visWebFlg": 0, // Visible on web flag (1=yes, 0=no)

    // Payment
    "pagId": 85213, // Payment ID
    "importoPag": "string", // Payment amount
    "pagatoFlg": 0, // Paid flag (1=yes, 0=no)
    "dataPagamento": "string", // Payment date (dd/MM/yyyy)
    "dataNotifica": "string", // Notification date (dd/MM/yyyy)
    "dataAccredito": "string", // Credit date (dd/MM/yyyy)
    "incassatoDa": "MAV", // Collected via (e.g. MAV)
    "iuv": "string", // Unique payment identifier (IUV)
    "codiceAvviso": "string", // PagoPA notice code
    "iur": "string", // Unique collection identifier (IUR)
    "nBollettino": "string", // Bulletin number
    "rendicontoId": 456987123, // Accounting report ID
    "regManFlg": 0, // Manual registration flag (1=yes, 0=no)
    "paDtVersamento": "string", // PA payment load date (dd/MM/yyyy)

    // Cancellation and refund
    "annullataFlg": 0, // Cancelled flag (1=yes, 0=no)
    "tipoRimbPagCod": "MAV", // Refund/payment type code
    "rimborsatoFlg": 0, // Refunded flag (1=yes, 0=no)
    "notaRimb": "string", // Refund note
    "codElabRimb": "string", // Refund processing code
    "numMandatoRimb": "string", // Refund mandate number
    "cauRimbCod": "string", // Refund reason code

    // No further charges
    "noAddebMoreFlg": 0, // No further charges flag (1=yes, 0=no)
    "noAddebMoreData": "string", // No further charges date (dd/MM/yyyy)
    "noAddebMoreNota": "string", // No further charges note
    "noAddebMoreUsrId": "string", // No further charges set by user

    // Notes
    "note": "string", // Note
    "notaCalcolo": "string" // Calculation note
  }
]
```

**`422 Unprocessable Entity`** — invalid parameters

```json
{
  "statusCode": 200,
  "retCode": -1,
  "retErrMsg": "Parametri non corretti",
  "errDetails": [
    {
      "errorType": "stackTrace", // Error type
      "value": "string", // Error message
      "rawValue": "string" // Raw error (JSON)
    }
  ]
}
```

<br>

---

<br>

## Endpoints - Attachments (Allegati)

## Endpoints - Invoices (Fatture)

## Endpoints - Payments (Pagamenti)

## Endpoints - Self-Certifications (Autocertificazioni)

## Endpoints - pagoPA (pagoPA)

---

## References

- **Swagger UI:** [Tasse Api V1 - ESSE3 REST Docs](<https://unimol.esse3.cineca.it/e3rest/docs/?urls.primaryName=Tasse%20Api%20V1%20(https%3A%2F%2Funimol.esse3.cineca.it%2Fe3rest%2Fapi%2Ftasse-service-v1)#/>)
- **Spec YAML:** [p05-tasseApiV1.yaml](https://unimol.esse3.cineca.it/e3rest/api/swagger-service-v1/swagger/specs/p05-tasseApiV1.yaml)
- **ESSE3 REST API General Documentation:** [wiki.u-gov.it](https://wiki.u-gov.it/confluence/display/ESSE3/Servizi+REST+su+ESSE3)

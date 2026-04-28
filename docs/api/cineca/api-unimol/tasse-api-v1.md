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
 * Each entry in the datiBorse array is processed individually - entries
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

**`422 Unprocessable Entity`** - invalid parameters

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

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

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

**`422 Unprocessable Entity`** - invalid parameters

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
 * processed individually - entries that fail validation are returned in the
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

**`422 Unprocessable Entity`** - invalid parameters

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

**`200 OK`** - rejection succeeded, no body returned

**`422 Unprocessable Entity`** - invalid parameters

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

**Cache:** `highRefreshRateUserIndependent` - high-frequency resource, HTTP cache and server cache enabled

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

**`422 Unprocessable Entity`** - invalid parameters

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

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

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

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /esoneri-anno-accademico/{aaId}` - Get valid exemptions for academic year

```java
/**
 * Returns the exemptions valid for a specific academic year, optionally
 * filtered by exemption code.
 *
 * @param aaId       long   (path, required)  - academic year ID
 * @param esoneroCod string (query, optional) - exemption code to filter by
 * @param start      int    (query, optional) - index of the first record to load,
 *                                              defaults to 0
 * @param limit      int    (query, optional) - number of records to retrieve
 *                                              starting from start, defaults
 *                                              to 50, allowed range: 0–100
 * @return List<EsoneriValidiAA> paginated list of valid exemptions for the
 *         academic year, or an empty array if none match
 */
GET /esoneri-anno-accademico/{aaId}
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "aaId": 2021, // Academic year ID
    "esoneroCod": "BORSA_BEN", // Exemption code (primary key)
    "esoneroDes": "string", // Exemption description
    "priorita": 1, // Priority
    "richiedibile": "SI/NO", // Can be requested by student (SI/NO)
    "esoneroAnnullabile": "SI/NO", // Can be cancelled (SI/NO)
    "tipoValutazione": "MANUALE", // Evaluation type
    "tipoScadPresDomanda": "ESO_W", // Application deadline type code
    "codiceEsterno": "string", // External code
    "desBeneficio": "string", // Benefit description
    "documentazione": "string", // Required documentation

    // Prerequisite
    "prereqRichiedId": 179, // Prerequisite exemption ID
    "prereqRichiedCod": "ESO_C_QUEST", // Prerequisite exemption code

    // Cumulated exemptions
    "esoneriCumulati": [
      {
        "esoneroCod": "ISU_B_PARZ", // Cumulated exemption code (primary key)
        "esoneroDes": "string" // Cumulated exemption description
      }
    ],

    // Evaluation conditions
    "frequenzaCampionamento": 15, // Sampling frequency
    "condCambioValutazioneId": 10, // Change evaluation condition ID
    "condCambioValutazioneCod": "CAMP_R", // Change evaluation condition code
    "condValutazioneId": 6, // Evaluation condition ID
    "condValutazioneCod": "DOPDUR_LEG", // Evaluation condition code
    "condValutazioneAltId": 62, // Alternative evaluation condition ID
    "condValutazioneAltCod": "STAMPA_MAV", // Alternative evaluation condition code

    // Income thresholds
    "iseeMax": 10000, // Maximum ISEE value
    "ispeMax": 10000, // Maximum ISPE value
    "redditoEquivalente": 10000, // Equivalent income threshold

    // Structure group
    "grpLivStruttDidId": 117, // Teaching structure group level ID
    "grpLivStruttDidCod": "COMP_CARR", // Teaching structure group level code
    "grpLivStruttDidDes": "string", // Teaching structure group level description

    // Merit band
    "fasciaMeritoId": 67, // Merit band ID
    "fasciaMeritoNum": 1, // Merit band number
    "fasciaMeritoDes": "Meritevole", // Merit band description

    // Income band
    "fasciaRedditoId": 4, // Income band ID
    "fasciaRedditoNum": 3, // Income band number
    "fasciaRedditoDes": "string", // Income band description

    // Audit
    "usrInsId": "Administrator", // Inserted by
    "dataIns": "string", // Insertion date (dd/MM/yyyy)
    "usrModId": "Administrator", // Last modified by
    "dataMod": "string" // Last modification date (dd/MM/yyyy)
  }
]
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /lista-esoneri-studente` - Get student exemptions

```java
/**
 * Returns the exemptions assigned to a student, optionally filtered by
 * degree course, enrollment year, external code, and modification date.
 *
 * @param stuId      long   (query, optional) - unique student ID
 * @param cdsId      long   (query, optional) - degree course ID
 * @param aaIscrId   long   (query, optional) - enrollment year ID
 * @param extStuCod  string (query, optional) - student code from external archive
 * @param dataMod    string (query, optional) - modification date filter (dd/MM/yyyy)
 * @param start      int    (query, optional) - index of the first record to load,
 *                                              defaults to 0
 * @param limit      int    (query, optional) - number of records to retrieve
 *                                              starting from start, defaults
 *                                              to 50, allowed range: 0–100
 * @return List<EsoneriPerStudente> paginated list of exemptions per student,
 *         or an empty array if none match
 */
GET /lista-esoneri-studente
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "persId": 5321, // Person ID
    "iscrId": 1234, // Enrollment ID (primary key)
    "stuId": 1235, // Student career ID (primary key)
    "extStuCod": "string", // External student code
    "cdsId": 2381, // Degree course ID (primary key)
    "aaOrdId": 2021, // Curriculum academic year ID (primary key)
    "pdsId": 9999, // Study plan ID (primary key)
    "aaIscrId": 2021, // Enrollment academic year ID
    "annoCorso": 1, // Current course year
    "anniFc": 1, // Out-of-course years
    "tipoIscrCod": "IC", // Enrollment type code
    "esoneroIscrCod": "string", // Enrollment exemption code
    "esoneroIscrDes": "string", // Enrollment exemption description
    "fasciaRedditoId": 4, // Income band ID
    "fasciaRedditoNum": 3, // Income band number
    "fasciaRedditoDes": "string", // Income band description
    "partTime": "SI", // Part-time student flag (SI/NO)
    "listaEsoneri": [
      {
        "esoneroCod": "ISU_B_PARZ", // Exemption code
        "esoneroDes": "string", // Exemption description
        "priorita": 1, // Priority
        "codiceRifDom": "string", // Application reference code
        "dataDomanda": "string", // Application date (dd/MM/yyyy)
        "ottenuto": "SI/NO", // Exemption granted (SI/NO)
        "dataOttenimento": "string", // Grant date (dd/MM/yyyy)
        "annullato": "SI/NO", // Cancelled (SI/NO)
        "dataAnnullamento": "string", // Cancellation date (dd/MM/yyyy)
        "respinto": "SI/NO", // Rejected (SI/NO)
        "dataRespingimento": "string", // Rejection date (dd/MM/yyyy)
        "motivoRespingimento": "string", // Rejection reason
        "statoRicorsoCod": "P", // Appeal status code
        "statoRicorsoDes": "string", // Appeal status description
        "motivoStatoRic": "string", // Appeal status reason
        "dataRicorso": "string", // Appeal date (dd/MM/yyyy)
        "dataPresDoc": "string", // Documentation submission date (dd/MM/yyyy)
        "usrInsId": "string", // Inserted by
        "dataIns": "string", // Insertion date (dd/MM/yyyy)
        "usrModId": "string", // Last modified by
        "dataMod": "string", // Last modification date (dd/MM/yyyy)
        "usrForzatura": "string", // Forced by
        "dataForzatura": "string" // Force date (dd/MM/yyyy)
      }
    ]
  }
]
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /lista-fatture` - Get invoices

```java
/**
 * Returns invoices linked to a person, regardless of charge type
 * (STU, AMM, PER). If payments are present, their data is included
 * in the response as well.
 *
 * @param persId               long    (query, optional) - unique person ID
 * @param fattId               long    (query, optional) - invoice ID
 * @param IUV                  string  (query, optional) - unique payment identifier
 * @param codiceAvviso         string  (query, optional) - PagoPA notice code
 * @param aaId                 long    (query, optional) - academic year ID
 * @param scadutoFlg           int     (query, optional) - expiry status filter;
 *                                                          1=expired only, 0=not
 *                                                          expired, null=all
 * @param pagatoFlg            int     (query, optional) - payment status filter;
 *                                                          1=paid only, 0=unpaid
 *                                                          only, null=all
 * @param fattAnnullata        int     (query, optional) - cancellation filter;
 *                                                          1=cancelled only,
 *                                                          0=not cancelled
 *                                                          (default: 0)
 * @param retrieveInfoAggiuntive boolean (query, optional) - whether to retrieve
 *                                                          additional invoice info;
 *                                                          requires fattId if true
 * @return List<Fattura> list of invoices with payment data where available,
 *         or an empty array if none match
 */
GET /lista-fatture
```

**Auth:** `UserTecnicoMassivo` · `PERSONA` · `STUDENTE` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    // Person info
    "persId": 1, // Person ID
    "nome": "Antonio", // First name
    "cognome": "Rossi", // Last name
    "codFis": "string", // Fiscal code
    "aaId": 2019, // Academic year ID

    // Invoice
    "fattId": 125478, // Invoice ID
    "scadFattura": "string", // Invoice due date (dd/MM/yyyy)
    "importoFattura": "string", // Invoice amount
    "fattScadutaFlg": 0, // Invoice expired flag (1=yes, 0=no)
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
    "infoAggiuntive": "string", // Additional info (populated if retrieveInfoAggiuntive=true)
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

    // PagoPA
    "pagopaEnabled": 0, // PagoPA payments enabled (1=yes, 0=no)
    "pagopaAvviso": 0, // PagoPA notice printable (1=yes, 0=no)
    "pagopaImmediato": 0, // PagoPA immediate payment available (1=yes, 0=no)

    // No further charges
    "noAddebMoreFlg": 0, // No further charges flag (1=yes, 0=no)
    "noAddebMoreData": "string", // No further charges date (dd/MM/yyyy)
    "noAddebMoreNota": "string", // No further charges note
    "noAddebMoreUsrId": "string" // No further charges set by user
  }
]
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /lista-pagamenti/{persId}` - Get payments by person

```java
/**
 * Returns payment data linked to a person, regardless of charge type
 * (STU, AMM, PER). Optionally filtered by invoice ID.
 *
 * @param persId long (path, required)  - unique person ID
 * @param fattId long (query, optional) - invoice ID to filter by
 * @return List<Pagamento> list of payments for the person,
 *         or an empty array if none are found
 */
GET /lista-pagamenti/{persId}
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    // Person info
    "nome": "Antonio", // First name
    "cognome": "Rossi", // Last name
    "codFis": "string", // Fiscal code
    "aaId": 2019, // Academic year ID

    // Invoice
    "fattId": 125478, // Invoice ID
    "scadFattura": "string", // Invoice due date (dd/MM/yyyy)
    "importoFattura": "string", // Invoice amount
    "fattMoraId": 123456, // Late fee invoice ID
    "moraAddFlg": 0, // Late fee added flag (1=yes, 0=no)
    "moraCount": 1, // Late fee count
    "desMav1": "string", // MAV description line 1
    "desMav2": "string", // MAV description line 2

    // Payment
    "pagId": 85213, // Payment ID
    "importoPag": "string", // Payment amount
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

    // No further charges
    "noAddebMoreFlg": 0, // No further charges flag (1=yes, 0=no)
    "noAddebMoreData": "string", // No further charges date (dd/MM/yyyy)
    "noAddebMoreNota": "string", // No further charges note
    "noAddebMoreUsrId": "string" // No further charges set by user
  }
]
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /lista-rimborsi/{persId}` - Get refunds by person

```java
/**
 * Returns refund data linked to a person, regardless of charge type
 * (STU, AMM, PER). If payments are present, their data is included
 * in the response as well.
 *
 * @param persId        long (path, required)  - unique person ID
 * @param rimborsatoFlg int  (query, optional) - refund status filter;
 *                                               1=refunded only, 0=not refunded,
 *                                               null=all
 * @return List<Rimborso> list of refunds for the person,
 *         or an empty array if none are found
 */
GET /lista-rimborsi/{persId}
```

**Auth:** `UserTecnicoMassivo` · `STUDENTE` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    // Person info
    "nome": "Antonio", // First name
    "cognome": "Rossi", // Last name
    "codFis": "string", // Fiscal code
    "aaId": 2019, // Academic year ID

    // Invoice
    "fattId": 125478, // Invoice ID
    "importoFattura": "string", // Invoice amount
    "scadFattura": "string", // Invoice due date (dd/MM/yyyy)
    "dataEmissione": "string", // Issue date (dd/MM/yyyy)
    "dataElab": "string", // Processing date (dd/MM/yyyy)
    "fattErrataId": 895623, // Erroneous invoice ID
    "fattAnnullata": 0, // Invoice cancelled flag (1=yes, 0=no)
    "desMav1": "string", // MAV description line 1
    "desMav2": "string", // MAV description line 2

    // Payment
    "pagId": 85213, // Payment ID
    "importoPag": "string", // Payment amount
    "dataPagamento": "string", // Payment date (dd/MM/yyyy)
    "dataNotifica": "string", // Notification date (dd/MM/yyyy)
    "dataAccredito": "string", // Credit date (dd/MM/yyyy)
    "incassatoDa": "MAV", // Collected via (e.g. MAV)
    "regManFlg": 0, // Manual registration flag (1=yes, 0=no)

    // Refund
    "rimborsatoFlg": 0, // Refunded flag (1=yes, 0=no)
    "notaRimb": "string", // Refund note
    "codElabRimb": "string", // Refund processing code
    "numMandatoRimb": "string", // Refund mandate number
    "cauRimbCod": "string" // Refund reason code
  }
]
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /parametri-iscrizioni-per-tasse/{stuId}` - Get enrollment parameters for fee calculation

```java
/**
 * Returns the relevant enrollment data for a student used in fee calculation,
 * optionally filtered by enrollment year.
 *
 * @param stuId    long   (path, required)  - unique student ID
 * @param aaIscrId long   (query, optional) - enrollment year ID
 * @param order    string (query, optional) - sort order; prefix + (ASC) or -
 *                                            (DESC) followed by field name;
 *                                            multiple fields comma-separated
 *                                            (e.g. +aaIscrId,-annoCorso)
 * @return List<IscrizionePerTasse> enrollment parameters used for fee
 *         calculation, or an empty array if none are found
 */
GET /parametri-iscrizioni-per-tasse/{stuId}
```

**Auth:** `UserTecnicoMassivo` · `STUDENTE` · `IMMATRICOLATI_IN_IPOTESI` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "persId": 1, // Person ID
    "stuId": 1, // Student career ID
    "cdsId": 2381, // Degree course ID
    "tipoCorsoCod": "L1", // Course type code
    "cdsDes": "string", // Degree course description
    "aaOrdId": 2019, // Curriculum academic year ID
    "pdsId": 9999, // Study plan ID
    "aaIscrId": 2019, // Enrollment academic year ID
    "annoCorso": 1, // Current course year
    "anniFc": 1, // Out-of-course years
    "tipoIscrCod": "IC", // Enrollment type code
    "tipoIscrCodDes": "In Corso", // Enrollment type description
    "fasciaId": 1, // Income band ID
    "partTime": "SI", // Part-time student flag (SI/NO)
    "isee": 10000, // ISEE value
    "durataAnni": 4, // Course duration in years
    "tipoEsoCod": "N", // Exemption type code
    "des": "string", // Exemption description
    "pesi": 13.5, // Weight value
    "anniCarr": 1, // Career years
    "merito": "string", // Merit indicator
    "frequenza": "string", // Attendance indicator
    "sogliaCfu": 1, // CFU threshold
    "sogliaIsee": 10000 // ISEE threshold
  }
]
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /semaforo/{stuId}` - Get student fee traffic light

```java
/**
 * Returns the fee traffic light status for a student, along with the total
 * amount due, expired fees, and outstanding fees.
 *
 * @param stuId   long   (path, required)  - unique student ID
 * @param aaId    long   (query, optional) - academic year ID
 * @param dataRif string (query, optional) - reference date for the calculation
 * @return ParametriSemaforo traffic light status with expired and due fee
 *         details, or 422 if parameters are invalid
 */
GET /semaforo/{stuId}
```

**Auth:** `UserTecnicoMassivo` · `STUDENTE` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
{
  "semaforo": "ROSSO", // Traffic light status (VERDE/GIALLO/ROSSO)
  "importoDovuto": "19,40", // Total amount due
  "tasseScadute": [
    // Expired fees
    {
      "fattId": 123456, // Invoice ID
      "tassaId": 123456, // Fee ID
      "tassaCod": "string", // Fee code
      "tassaDes": "string", // Fee description
      "voceId": 123456, // Voice ID
      "voceCod": "string", // Voice code
      "voceDes": "string", // Voice description
      "importoVoce": "10,50", // Charge amount
      "dataScadenza": "string", // Due date (dd/MM/yyyy)
      "dataPagTollerataMax": "string" // Maximum tolerated payment date (dd/MM/yyyy)
    }
  ],
  "tasseDovute": [
    // Outstanding fees not yet expired
    {
      "fattId": 123456, // Invoice ID
      "tassaId": 123456, // Fee ID
      "tassaCod": "string", // Fee code
      "tassaDes": "string", // Fee description
      "voceId": 123456, // Voice ID
      "voceCod": "string", // Voice code
      "voceDes": "string", // Voice description
      "importoVoce": "10,50", // Charge amount
      "dataScadenza": "string", // Due date (dd/MM/yyyy)
      "dataPagTollerataMax": "string" // Maximum tolerated payment date (dd/MM/yyyy)
    }
  ]
}
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `POST /allegati/{fattId}/allegatiFattura` - Insert invoice attachment metadata

```java
/**
 * Inserts the metadata for a new attachment linked to a specific invoice.
 * The response includes a Location header pointing to the URL for uploading
 * the associated blob.
 *
 * @param fattId long   (path, required) - invoice ID
 * @param body   object (body, required) - attachment metadata containing:
 *                 - filename          string - file name
 *                 - autore            string - author
 *                 - titolo            string - title
 *                 - descrizione       string - free text description
 *                 - tipologiaAllegato string - attachment type code (e.g. ACC_RIS)
 *                 - validoFlg         int    - valid flag (1=yes, 0=no)
 *                 - abilVisWeb        int    - web visibility enabled (1=yes, 0=no)
 * @return 201 with Location header for blob upload,
 *         or 422 if parameters are invalid
 */
POST /allegati/{fattId}/allegatiFattura
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "filename": "readme.txt", // File name
  "autore": "mario rossi", // Author
  "titolo": "string", // Title
  "descrizione": "string", // Free text description
  "tipologiaAllegato": "ACC_RIS", // Attachment type code
  "validoFlg": 0, // Valid flag (1=yes, 0=no)
  "abilVisWeb": 0 // Web visibility enabled (1=yes, 0=no)
}
```

#### Response

**`201 Created`** - metadata inserted; check the `Location` response header for the blob upload URL

**`422 Unprocessable Entity`** - invalid parameters

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

## Endpoints - Invoices (Fatture)

### `PUT /annullaFattura/{fattId}/tipoAnnullamento/{tipoAnnullamento}` - Cancel invoice

```java
/**
 * Cancels an invoice issued in ESSE3 for student or person fees.
 *
 * Return codes:
 *   1  - Cancellation completed successfully
 *  -1  - Cancellation failed
 *  -2  - Cancellation impossible for zero-amount invoice
 *  -3  - Error cancelling late fees linked to the invoice
 *  -4  - Invoice already cancelled
 *  -5  - Invoice already paid
 * -20  - Cancellation blocked - at least one linked late fee is in paid status
 *
 * @param fattId           long (path, required) - ID of the invoice to cancel
 * @param tipoAnnullamento int  (path, required) - cancellation type; allowed
 *                                                  values: 1 or 2
 * @return AnnullamentoFattura outcome code and description,
 *         or 422 if parameters are invalid
 */
PUT /annullaFattura/{fattId}/tipoAnnullamento/{tipoAnnullamento}
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Response

**`200 OK`**

```json
{
  "esitoAnnullamento": 1, // Return code (see codes above)
  "returnMessage": "string" // Outcome description
}
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `POST /fattura` - Create student invoice

```java
/**
 * Creates an invoice associated with a specific academic year and student,
 * containing one or more fees and their respective charge lines.
 *
 * @param body object (body, required) - invoice data containing:
 *               - aaId                    int     - academic year ID
 *               - stuId                   long    - student career ID
 *               - escludiDaRicalcolo      boolean - exclude from recalculation
 * *             - notaEsclusioneRicalcolo  string  - recalculation exclusion note
 *               - tasse                   array   - list of fees, each with a
 *                                                   fee code and charge lines
 * @return 201 if invoice created successfully,
 *         422 if creation failed or parameters are invalid
 */
POST /fattura
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "aaId": 2023, // Academic year ID
  "stuId": 1234, // Student career ID
  "escludiDaRicalcolo": true, // Exclude from recalculation (true/false)
  "notaEsclusioneRicalcolo": "string", // Recalculation exclusion note
  "tasse": [
    {
      "tassaCod": "T-ISCR", // Fee code
      "voci": [
        {
          "dataScadenza": "string", // Due date (dd/MM/yyyy)
          "importo": 100.2, // Amount
          "rataId": 101, // Installment ID
          "voceCod": "BOLLO", // Voice code
          "nota": "string" // Note
        }
      ]
    }
  ]
}
```

#### Response

**`201 Created`** - invoice created, no body returned

**`422 Unprocessable Entity`** - invoice creation failed or invalid parameters

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

### `GET /fattura/{fattId}` - Get invoice by ID

```java
/**
 * Returns the full data of a specific invoice, including payment details
 * if a payment is present.
 *
 * @param fattId long (path, required) - invoice ID to retrieve
 * @return Fattura invoice data with payment details where available,
 *         or 422 if parameters are invalid
 */
GET /fattura/{fattId}
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
{
  // Person info
  "persId": 1, // Person ID
  "nome": "Antonio", // First name
  "cognome": "Rossi", // Last name
  "codFis": "string", // Fiscal code
  "aaId": 2019, // Academic year ID

  // Invoice
  "fattId": 125478, // Invoice ID
  "scadFattura": "string", // Invoice due date (dd/MM/yyyy)
  "importoFattura": "string", // Invoice amount
  "fattScadutaFlg": 0, // Invoice expired flag (1=yes, 0=no)
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
  "infoAggiuntive": "string", // Additional invoice info
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

  // PagoPA
  "pagopaEnabled": 0, // PagoPA payments enabled (1=yes, 0=no)
  "pagopaAvviso": 0, // PagoPA notice printable (1=yes, 0=no)
  "pagopaImmediato": 0, // PagoPA immediate payment available (1=yes, 0=no)

  // No further charges
  "noAddebMoreFlg": 0, // No further charges flag (1=yes, 0=no)
  "noAddebMoreData": "string", // No further charges date (dd/MM/yyyy)
  "noAddebMoreNota": "string", // No further charges note
  "noAddebMoreUsrId": "string" // No further charges set by user
}
```

**`422 Unprocessable Entity`** - invalid parameters

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

## Endpoints - Payments (Pagamenti)

### `PUT /annullaPagamento/{fattId}/annullaConvalida/{annullaConv}` - Cancel manual payment

```java
/**
 * Cancels a manually acquired payment associated with a specific invoice,
 * optionally also cancelling the payment validation.
 *
 * @param fattId     long (path, required) - invoice ID whose payment to cancel
 * @param annullaConv int (path, required) - whether to also cancel the payment
 *                                           validation (1=yes, 0=no)
 * @return 200 if cancellation succeeded, 404 if invoice not found,
 *         422 if parameters are invalid
 */
PUT /annullaPagamento/{fattId}/annullaConvalida/{annullaConv}
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Response

**`200 OK`** - cancellation succeeded, no body returned

**`404 Not Found`** - invoice not found

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

**`422 Unprocessable Entity`** - invalid parameters

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

### `POST /incassi/inserisciIncasso` - Insert payment

```java
/**
 * Inserts the data of a new payment associated with a specific invoice.
 *
 * @param body object (body, required) - payment data containing:
 *               - idTransazione long   - transaction ID
 *               - fattId        long   - invoice ID
 *               - importo       double - payment amount
 *               - dataPagamento string - payment date (dd/MM/yyyy hh:mm:ss)
 *               - provenienza   string - payment origin (e.g. PA)
 * @return RisultatoIncasso return code and confirmation message,
 *         or 422 if parameters are invalid
 */
POST /incassi/inserisciIncasso
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "idTransazione": 123456789, // Transaction ID
  "fattId": 15987, // Invoice ID
  "importo": 10109.89, // Payment amount
  "dataPagamento": "string", // Payment date (dd/MM/yyyy hh:mm:ss)
  "provenienza": "PA" // Payment origin (e.g. PA)
}
```

#### Response

**`201 Created`**

```json
{
  "returnCode": 1, // Return code (1=success)
  "returnMessage": "string" // Confirmation message
}
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `POST /pagaFattura` - Acquire manual payment

```java
/**
 * Acquires a manual payment for a specific invoice.
 *
 * Return codes:
 *  1 - Payment acquired successfully
 *  2 - Payment acquired successfully - late fee generated
 *  3 - Payment acquired successfully - amount less than invoice, wrong payment handled
 *  4 - Payment acquired successfully - amount greater than invoice, wrong payment handled
 *  5 - Payment acquired successfully - amount less than invoice, wrong payment handled and late fee generated
 *  6 - Payment acquired successfully - amount greater than invoice, wrong payment handled and late fee generated
 * -1 - Error inserting payment
 *
 * @param body object (body, required) - payment data containing:
 *               - fattId             long   - invoice ID
 *               - importo            double - payment amount
 *               - dataPagamento      string - payment date (dd/MM/yyyy hh:mm:ss)
 *               - tipoPagamento      string - payment type
 *               - numBolletino       string - bulletin number
 *               - ripartAutoErrPag   int    - auto-distribute wrong payment (1=yes, 0=no)
 *               - convalidaPagamento int    - validate payment (1=yes, 0=no)
 *               - dataAccredito      string - credit date (dd/MM/yyyy hh:mm:ss)
 *               - annoFinanziario    int    - financial year
 *               - contoCorrenteId    long   - bank account ID
 * @return EsitoPagamento return code and outcome message,
 *         or 422 if parameters are invalid
 */
POST /pagaFattura
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "fattId": 15987, // Invoice ID
  "importo": 10109.89, // Payment amount
  "dataPagamento": "string", // Payment date (dd/MM/yyyy hh:mm:ss)
  "tipoPagamento": "PA", // Payment type
  "numBolletino": "1234567", // Bulletin number
  "ripartAutoErrPag": 1, // Auto-distribute wrong payment (1=yes, 0=no)
  "convalidaPagamento": 1, // Validate payment (1=yes, 0=no)
  "dataAccredito": "string", // Credit date (dd/MM/yyyy hh:mm:ss)
  "annoFinanziario": 2022, // Financial year
  "contoCorrenteId": 1 // Bank account ID
}
```

#### Response

**`201 Created`**

```json
{
  "esito": 1, // Return code (see codes above)
  "returnMessage": "string" // Outcome message
}
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `POST /spg/notifyStatus` - Update transaction status

```java
/**
 * Updates the status of a payment transaction in ESSE3, as notified
 * by an external payment gateway (e.g. Flywire). Supports multi-item
 * carts where each item can carry its own status and amount.
 *
 * @param body object (body, required) - transaction notification containing:
 *               - eventDate string - event timestamp (ISO 8601)
 *               - channel    string - payment gateway identifier (e.g. FLYWIRE)
 *               - cart       object - cart data with transaction ID, overall
 *                                     status, and list of cart items
 * @return EsitoNotifica outcome code and message,
 *         or 422 if parameters are invalid
 */
POST /spg/notifyStatus
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "eventDate": "string", // Event timestamp (ISO 8601)
  "channel": "FLYWIRE", // Payment gateway identifier
  "cart": {
    "transId": "string", // Transaction ID
    "cartStatusCod": "IN_PROGRESS", // Cart status code
    "cartStatusDes": "string", // Cart status description
    "cartItem": [
      {
        "cartItemNum": 1, // Cart item number
        "cartItemExtId": 1234, // Cart item external ID (invoice ID)
        "cartItemStatusCod": "string", // Item status code
        "cartItemStatusDes": "string", // Item status description
        "amount": 100.2, // Payment amount
        "currency": "EUR", // Currency code
        "paymentDate": "string", // Payment date (ISO 8601)
        "channelPaymentId": "string", // Gateway payment ID
        "statusChanged": true // Whether status changed with this notification
      }
    ]
  }
}
```

#### Response

**`201 Created`**

```json
{
  "esito": 1, // Return code (1=success)
  "returnMessage": "string" // Outcome message
}
```

**`422 Unprocessable Entity`** - invalid parameters

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

## Endpoints - Self-Certifications (Autocertificazioni)

### `GET /autocert/{persId}/annoAcc/{aaId}` - Get self-certifications by person and academic year

```java
/**
 * Returns all self-certification (autocertificazione) data linked to a person
 * for a specific academic year, including ISEE values, income bands, household
 * members, and their income entries.
 *
 * @param persId long   (path, required)  - unique person ID
 * @param aaId   long   (path, required)  - academic year ID
 * @param start  int    (query, optional) - index of the first record to load,
 *                                          defaults to 0
 * @param limit  int    (query, optional) - number of records to retrieve
 *                                          starting from start, defaults
 *                                          to 50, allowed range: 0–100
 * @param order  string (query, optional) - sort order; prefix + (ASC) or -
 *                                          (DESC) followed by field name;
 *                                          multiple fields comma-separated
 *                                          (e.g. +aaId,-dataPresentazione)
 * @return List<Autocert> paginated list of self-certifications,
 *         or an empty array if none are found
 */
GET /autocert/{persId}/annoAcc/{aaId}
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "persId": 1234, // Person ID
    "autocertId": 1234, // Self-certification ID (primary key)
    "aaId": 2020, // Academic year ID
    "dataPresentazione": "string", // Submission date (dd/MM/yyyy)
    "dataCaricamento": "string", // Load date (dd/MM/yyyy)
    "dataUltimaModif": "string", // Last modification date (dd/MM/yyyy)
    "dataSottoscr": "string", // Subscription date (dd/MM/yyyy)
    "dataCartaceo": "string", // Paper submission date (dd/MM/yyyy)
    "versione": "PRESENTATA", // Version status

    // ISEE data
    "isee": 10109.89, // ISEE value
    "ispe": 10109.89, // ISPE value
    "tipologiaIsee": "O", // ISEE type code
    "iseeCorrenteFlg": 1, // Current ISEE flag (1=yes, 0=no)
    "protIsee": "string", // ISEE protocol number
    "dataRilIsee": "string", // ISEE release date (dd/MM/yyyy)
    "dataRilIseeSost": "string", // Substitute ISEE release date (dd/MM/yyyy)
    "protDsuSost": "string", // Substitute DSU protocol number
    "identificatoreFlusso": "string", // Flow identifier
    "iseeuDichId": 123, // ISEE-U declaration ID
    "protCaaf": "string", // CAAF protocol number
    "difformitaFlg": 1, // Discrepancy flag (1=yes, 0=no)

    // Income band
    "fasciaId": 2, // Income band ID
    "fasciaNum": 2, // Income band number
    "fasciaDes": "Fascia 2", // Income band description

    // Flags
    "reddNondichFlg": 1, // Undeclared income flag (1=yes, 0=no)
    "noVerifReddFlg": 1, // No income verification flag (1=yes, 0=no)
    "modDopoPresFlg": 1, // Modified after submission flag (1=yes, 0=no)
    "nuclAutonomoFlg": 1, // Autonomous household flag (1=yes, 0=no)
    "errataFlg": 1, // Error flag (1=yes, 0=no)
    "noAddebMoreFlg": 1, // No further charges flag (1=yes, 0=no)
    "noAddebMoreNota": "string", // No further charges note
    "dataStampaVerb": "string", // Verbal print date (dd/MM/yyyy)

    // Override
    "forzaturaId": 1, // Override ID
    "forzaturaDes": "string", // Override description

    // Household members
    "componenti": [
      {
        "cognome": "Rossi", // Member last name
        "nome": "Mario", // Member first name
        "codFiscale": "string", // Member fiscal code
        "parentela": "Padre", // Relationship to applicant
        "redditi": [
          {
            "tipoRedditoId": 1, // Income type ID
            "tipiRedditiCod": "string", // Income type code
            "tipiRedditiDes": "string", // Income type description
            "tipoDato": "string", // Data type description
            "importo": 10109.89, // Income amount
            "valoreFlg": 1, // Value flag
            "valoreTesto": "string", // Text value
            "valoreData": "string" // Date value (dd/MM/yyyy)
          }
        ]
      }
    ]
  }
]
```

**`422 Unprocessable Entity`** - invalid parameters

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

## Endpoints - pagoPA (pagoPA)

### `PUT /pagopa/avviso/{fattId}` - Get PagoPA payment notice

```java
/**
 * Returns the PagoPA payment notice for a specific invoice as a binary file.
 *
 * @param fattId long (path, required) - invoice ID for which to generate
 *                                       the payment notice
 * @return binary PDF payment notice as application/octet-stream,
 *         404 if invoice ID is invalid, or 422 if parameters are invalid
 */
PUT /pagopa/avviso/{fattId}
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` · `IMMATRICOLATI_IN_IPOTESI` · `REGISTRATO` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** none

#### Response

**`200 OK`** - `application/octet-stream` - binary PagoPA payment notice file

**`404 Not Found`** - invalid invoice ID

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

**`422 Unprocessable Entity`** - invalid parameters

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

### `PUT /pagopa/chiediStatoVersamento/{fattId}` - Check and update PagoPA payment status

```java
/**
 * Queries the current payment status for a specific invoice from the PagoPA
 * system. If the payment has been completed, the status is automatically
 * updated in ESSE3.
 *
 * @param fattId long (path, required) - invoice ID to check
 * @return StatoVersamentoPagoPA full payment status with debtor info,
 *         invoice details, and charge lines;
 *         404 if invoice ID is invalid, or 422 if parameters are invalid
 */
PUT /pagopa/chiediStatoVersamento/{fattId}
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
{
  // Debtor info
  "cognome": "Rossi", // Last name
  "nome": "Morgan", // First name
  "codFis": "string", // Fiscal code
  "ragioneSociale": "string", // Company name
  "indirizzo": "string", // Street address
  "civico": "string", // Street number
  "cap": "string", // Postal code
  "localita": "string", // Municipality
  "provincia": "string", // Province code
  "nazione": "string", // Country
  "email": "string", // Email
  "telefono": "string", // Phone number
  "cellulare": "string", // Mobile number

  // Invoice and payment status
  "fattId": 1234, // Invoice ID
  "codiceAvviso": "string", // PagoPA notice code
  "iuv": "string", // Unique payment identifier (IUV)
  "importoVersamento": 100.2, // Payment amount
  "causale": "string", // Payment reason
  "dataScadFatt": "string", // Invoice due date (dd/MM/yyyy)
  "annullato": 0, // Cancelled flag (1=yes, 0=no)
  "pagato": 0, // Paid flag (1=yes, 0=no)
  "dataVersamento": "string", // Payment date (dd/MM/yyyy)
  "dataVerificaVersamento": "string", // Payment verification date (dd/MM/yyyy)
  "dataAnnullamentoVersamento": "string", // Payment cancellation date (dd/MM/yyyy)
  "dataNotificaPagamento": "string", // Payment notification date (dd/MM/yyyy)
  "dataStampaAvviso": "string", // Notice print date (dd/MM/yyyy)
  "esitoStampaAvviso": "OK", // Notice print outcome

  // Charge lines
  "voci": [
    {
      "codTassonomia": "string", // Taxonomy code
      "ibanAccredito": "string", // Credit IBAN
      "ibanAppoggio": "string", // Support IBAN
      "importoVoce": 100.2, // Voice amount
      "voceCod": "BOLLO", // Voice code
      "voceDes": "string" // Voice description
    }
  ]
}
```

**`404 Not Found`** - invalid invoice ID

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

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /pagopa/quietanza/{fattId}/lingua/{lang}` - Get PagoPA payment receipt

```java
/**
 * Returns the PagoPA payment receipt for a specific invoice as a binary file,
 * in the requested language.
 *
 * @param fattId long   (path, required) - invoice ID for which to generate
 *                                         the payment receipt
 * @param lang   string (path, required) - language code for the receipt;
 *                                         'it' for Italian, 'en' for English
 * @return binary PDF payment receipt as application/octet-stream,
 *         404 if invoice ID is invalid, or 422 if parameters are invalid
 */
GET /pagopa/quietanza/{fattId}/lingua/{lang}
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` · `IMMATRICOLATI_IN_IPOTESI` · `REGISTRATO` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** none

#### Response

**`200 OK`** - `application/octet-stream` - binary PagoPA payment receipt file

**`404 Not Found`** - invalid invoice ID

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

**`422 Unprocessable Entity`** - invalid parameters

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

### `POST /pagopa/transaction` - Initiate PagoPA immediate payment transaction

```java
/**
 * Initiates an immediate PagoPA payment transaction in ESSE3 for a specific
 * invoice. Returns the PagoPA redirect URL where the user should be sent
 * to complete the payment.
 *
 * @param body object (body, required) - transaction data containing:
 *               - fattId     long   - invoice ID to pay
 *               - returnURL  string - URL to redirect back to after payment
 * @return TransazionePagoPA redirect URL for the PagoPA payment gateway;
 *         422 if parameters are invalid;
 *         502 if the payment gateway call failed and no redirect URL was received
 */
POST /pagopa/transaction
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` · `IMMATRICOLATI_IN_IPOTESI` · `REGISTRATO` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "fattId": 1234, // Invoice ID to pay
  "returnURL": "https://www.esse3.com/path" // Return URL after payment
}
```

#### Response

**`201 Created`**

```json
{
  "redirectUrlPagoPA": "string" // PagoPA gateway URL to redirect the user to
}
```

**`422 Unprocessable Entity`** - invalid parameters

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

**`502 Bad Gateway`** - payment gateway call failed, redirect URL not received

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

### `GET /pagopa/transazioni` - Get PagoPA transactions

```java
/**
 * Returns the data of PagoPA transactions, optionally filtered by invoice,
 * IUV, academic year, fiscal code, and transaction state.
 *
 * @param fattId      long   (query, optional) - invoice ID
 * @param IUV         string (query, optional) - unique payment identifier
 * @param aaId        long   (query, optional) - academic year ID
 * @param codFis      string (query, optional) - student fiscal code
 * @param statoFinale int    (query, optional) - filter by final transaction
 *                                               state (1=final, 0=not final)
 * @param lastTrans   int    (query, optional) - filter by last transaction
 *                                               only (1=yes, 0=no)
 * @return List<TransazionePagoPA> list of PagoPA transactions,
 *         or an empty array if none match
 */
GET /pagopa/transazioni
```

**Auth:** `UserTecnicoMassivo` · `STUDENTE` · `IMMATRICOLATI_IN_IPOTESI` · `REGISTRATO` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `highRefreshRateUserIndependent` - high-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    // Debtor info
    "cognome": "Rossi", // Last name
    "nome": "Morgan", // First name
    "codFis": "string", // Fiscal code

    // Transaction data
    "fattId": 1234, // Invoice ID
    "aaId": 2022, // Academic year ID
    "iuv": "string", // Unique payment identifier (IUV)
    "iur": "string", // Unique collection identifier (IUR)
    "codiceAvviso": "string", // PagoPA notice code
    "codiceContestoPagamento": "string", // Payment context code
    "importo": 100.2, // Transaction amount
    "importoPagato": 100.2, // Paid amount
    "dataTransazione": "string", // Transaction date (dd/MM/yyyy)
    "dataPagamento": "string", // Payment date (dd/MM/yyyy)

    // Transaction status
    "esitoCod": "PAGAMENTO_ESEGUITO", // Outcome code
    "esitoDes": "string", // Outcome description
    "stato": "OK", // Transaction state
    "statoFinale": 0, // Final state flag (1=yes, 0=no)
    "esitoTransazione": "OK", // Transaction outcome
    "esitoMessaggio": [
      {
        "lingua": "ita", // ISO 639-2 language code
        "testo": "string" // Outcome message text
      }
    ],

    // Payment flags
    "pagatoFlg": 0, // Paid flag (1=yes, 0=no)
    "quietanzaStampabile": 0, // Receipt printable flag (1=yes, 0=no)
    "esisteIncasso": 0, // Collection exists flag (1=yes, 0=no)
    "incassoDaGestire": 0, // Collection to handle flag (1=yes, 0=no)
    "erroreIncasso": "string" // Collection error message
  }
]
```

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /pagopa/versamenti/multiben/ente/{ente}` - Get multi-beneficiary payments

```java
/**
 * Returns multi-beneficiary payment data for a specific entity, optionally
 * filtered by IUV, IUR, payment date range, secondary entity domain, IBAN,
 * reporting flow code, and debt year.
 *
 * @param ente                   string (path, required)  - entity querying the service
 * @param IUV                    string (query, optional) - unique payment identifier
 * @param iur                    string (query, optional) - unique collection identifier
 * @param dataPagamentoDa        string (query, optional) - payment date lower bound
 *                                                          (dd/MM/yyyy)
 * @param dataPagamentoA         string (query, optional) - payment date upper bound
 *                                                          (dd/MM/yyyy)
 * @param dominioEnteSecondario  string (query, optional) - secondary entity domain code
 * @param ibanAccredito          string (query, optional) - secondary entity credit IBAN
 * @param codFlussoRendicontazione string (query, optional) - PagoPA reporting flow code
 * @param aaDebito               long   (query, optional) - debt year
 * @return List<VersamentoMultiben> list of multi-beneficiary payments,
 *         404 if parameters are inconsistent or no payment found,
 *         422 if parameters are invalid
 */
GET /pagopa/versamenti/multiben/ente/{ente}
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    // Debtor info
    "nome": "Antonio", // First name
    "cognome": "Rossi", // Last name
    "codFis": "string", // Fiscal code
    "ragioneSociale": "string", // Company name
    "indirizzo": "string", // Street address
    "civico": "string", // Street number
    "cap": "string", // Postal code
    "localita": "string", // Municipality
    "provincia": "string", // Province code
    "nazione": "string", // Country

    // Payment data
    "aaDebito": 2019, // Debt year
    "codDominioPrincipale": "string", // Principal entity domain code
    "codApplicazione": "string", // Application code
    "iuv": "string", // Unique payment identifier (IUV)
    "iur": "string", // Unique collection identifier (IUR)
    "codiceAvviso": "string", // PagoPA notice code
    "codiceVersamentoEnte": 125478, // Entity payment code
    "importoVersamento": 100.2, // Total payment amount
    "causaleVersamento": "string", // Payment reason
    "codUoVersamento": "string", // Payment organizational unit code
    "dataPagamento": "string", // Payment date (dd/MM/yyyy)
    "codFlussoRendicontazione": "string", // Reporting flow code

    // Single payment line
    "importoSingoloVersamento": 100.2, // Single payment line amount
    "causaleSingoloVersamento": "string", // Single payment line reason
    "codTassonomia": "string", // Taxonomy code
    "desTassonomia": "string", // Taxonomy description
    "codUoSingoloVersamento": "string", // Single payment organizational unit code
    "codDominioSingoloVersamento": "string", // Single payment domain code
    "ibanAccredito": "string", // Credit IBAN
    "ibanAppoggio": "string" // Support IBAN
  }
]
```

**`404 Not Found`** - inconsistent parameters or payment not found

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

**`422 Unprocessable Entity`** - invalid parameters

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

### `GET /pagopa/versamento` - Get PagoPA payment details

```java
/**
 * Returns the full details of a PagoPA payment, identified by invoice ID
 * or IUV. At least one of the two parameters should be provided.
 *
 * @param fattId long   (query, optional) - invoice ID
 * @param IUV    string (query, optional) - unique payment identifier
 * @return VersamentoPagoPA payment details with debtor info and charge lines;
 *         404 if parameters are inconsistent or payment not found,
 *         422 if parameters are invalid
 */
GET /pagopa/versamento
```

**Auth:** `UserTecnicoMassivo` required · Supported: `Basic`, `JWT`

**Cache:** `configuration` - configuration resource, very slow-changing, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
{
  // Debtor info
  "cognome": "Rossi", // Last name
  "nome": "Morgan", // First name
  "codFis": "string", // Fiscal code
  "ragioneSociale": "string", // Company name
  "indirizzo": "string", // Street address
  "civico": "string", // Street number
  "cap": "string", // Postal code
  "localita": "string", // Municipality
  "provincia": "string", // Province code
  "nazione": "string", // Country
  "email": "string", // Email
  "telefono": "string", // Phone number
  "cellulare": "string", // Mobile number

  // Invoice and payment status
  "fattId": 1234, // Invoice ID
  "codiceAvviso": "string", // PagoPA notice code
  "iuv": "string", // Unique payment identifier (IUV)
  "importoVersamento": 100.2, // Payment amount
  "causale": "string", // Payment reason
  "dataScadFatt": "string", // Invoice due date (dd/MM/yyyy)
  "annullato": 0, // Cancelled flag (1=yes, 0=no)
  "pagato": 0, // Paid flag (1=yes, 0=no)
  "dataVersamento": "string", // Payment date (dd/MM/yyyy)
  "dataVerificaVersamento": "string", // Payment verification date (dd/MM/yyyy)
  "dataAnnullamentoVersamento": "string", // Payment cancellation date (dd/MM/yyyy)
  "dataNotificaPagamento": "string", // Payment notification date (dd/MM/yyyy)
  "dataStampaAvviso": "string", // Notice print date (dd/MM/yyyy)
  "esitoStampaAvviso": "OK", // Notice print outcome

  // Charge lines
  "voci": [
    {
      "codTassonomia": "string", // Taxonomy code
      "ibanAccredito": "string", // Credit IBAN
      "ibanAppoggio": "string", // Support IBAN
      "importoVoce": 100.2, // Voice amount
      "voceCod": "BOLLO", // Voice code
      "voceDes": "string" // Voice description
    }
  ]
}
```

**`404 Not Found`** - inconsistent parameters or payment not found

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

**`422 Unprocessable Entity`** - invalid parameters

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

---

## References

- **Swagger UI:** [Tasse Api V1 - ESSE3 REST Docs](<https://unimol.esse3.cineca.it/e3rest/docs/?urls.primaryName=Tasse%20Api%20V1%20(https%3A%2F%2Funimol.esse3.cineca.it%2Fe3rest%2Fapi%2Ftasse-service-v1)#/>)
- **Spec YAML:** [p05-tasseApiV1.yaml](https://unimol.esse3.cineca.it/e3rest/api/swagger-service-v1/swagger/specs/p05-tasseApiV1.yaml)
- **ESSE3 REST API General Documentation:** [wiki.u-gov.it](https://wiki.u-gov.it/confluence/display/ESSE3/Servizi+REST+su+ESSE3)

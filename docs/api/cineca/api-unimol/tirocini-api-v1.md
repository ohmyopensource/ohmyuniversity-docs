---
title: Tirocini API V1 | OhMyUniversity!
description: REST API documentation for the Tirocini service (tirocini-service-v1) - internships and stages management in CINECA ESSE3.
head:
  - - meta
    - property: og:title
      content: Tirocini API V1 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Tirocini service (tirocini-service-v1) - internships and stages management in CINECA ESSE3.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/cineca/api-unimol/tirocini-api-v1
  - - meta
    - name: keywords
      content: tirocini api, stages api, internship api, esse3 rest api, cineca api, ohmyuniversity api, domanda tirocinio, azienda, convenzione, tutor
  - - meta
    - name: twitter:title
      content: Tirocini API V1 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Tirocini service (tirocini-service-v1) - internships and stages management in CINECA ESSE3.
---

# OhMyUniversity! - Unimol: Tirocini API V1

**ENG:** `Internships & Stages`

**Version:** `1.1.0` · **Base URL:** `/tirocini-service-v1`

REST API for accessing the internships and stages area in ESSE3, covering student career tracks, company management, agreements, internship applications, and related questionnaires.

---

## Endpoints - Student ID Number (Matricola)

### `GET /tirocini` - Get eligible student career tracks

```java
/**
 * Returns the list of student career tracks eligible for an internship
 * application. At least one filter parameter must be provided.
 *
 * @param matricola      string (query, optional) - student ID number
 * @param cdsStuId       long   (query, optional) - student degree course ID
 * @param cdsStuCod      string (query, optional) - student degree course code
 * @param aaOrdStuId     int    (query, optional) - study plan regulation year
 *                                                   (exactly 4 digits)
 * @param pdsStuId       long   (query, optional) - student study plan ID
 * @param pdsStuCod      string (query, optional) - student study plan code
 * @param optionalFields string (query, optional) - comma-separated list of
 *                                                   optional fields to include;
 *                                                   use ALL for all fields;
 *                                                   supports Ant Glob Patterns
 *                                                   (e.g. childObj.prop1,
 *                                                   childObj.*, childObj.**)
 * @param fields         string (query, optional) - same as optionalFields;
 *                                                   alternative parameter for
 *                                                   optional field selection
 * @param start          int    (query, optional) - index of the first record
 *                                                   to load, defaults to 0
 * @param limit          int    (query, optional) - number of records to retrieve
 *                                                   starting from start, defaults
 *                                                   to 50, allowed range: 0–100
 * @param order          string (query, optional) - sort order; prefix + (ASC) or
 *                                                   - (DESC) followed by field name;
 *                                                   multiple fields comma-separated
 *                                                   (e.g. +matricola,-cdsCod)
 * @return List<TrattoCarriera> paginated list of eligible career tracks,
 *         or an empty array if none match
 */
GET /tirocini
```

> At least one filter parameter must be provided.

**Auth:** `UTENTE_TECNICO` · `STUDENTE` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserDependent` - medium-frequency resource, HTTP cache enabled, server cache disabled

#### Response

**`200 OK`**

```json
[
  {
    "persId": 1, // Person ID
    "stuId": 1, // Student ID
    "matId": 1, // Enrollment ID
    "cognome": "string", // Last name
    "nome": "string", // First name
    "codiceFiscale": "string", // Fiscal code
    "matricola": "123456", // Student ID number
    "cdsId": 1, // Degree course ID
    "cdsCod": "CDS_1", // Degree course code
    "cdsDes": "string", // Degree course description
    "aaOrdId": 2016, // Curriculum academic year ID
    "pdsId": 1, // Study plan ID
    "pdsCod": "PDS_1", // Study plan code
    "pdsDes": "string", // Study plan description
    "aaRegId": 2016, // Cohort academic year ID
    "staStuCod": "A", // Career status code
    "staStuDes": "Attivo", // Career status description
    "staMatCod": "A", // Enrollment status code
    "staMatDes": "Attivo", // Enrollment status description
    "umPesoCod": "C", // Weight unit code
    "umPesoDes": "Crediti", // Weight unit description
    "codiceLettore": "7000", // Reader code
    "titoloStudio": 3, // Degree title type
    "tipoLettore": "SM", // Reader type code
    "autDatiPersonali": "S", // Personal data authorization
    "statoTasse": 1, // Tax payment status
    "aaImm1": 2021, // First enrollment academic year (optional field)
    "tipoCorsoCod": "LM", // Course type code (optional field)
    "tipoCorsoDes": "string", // Course type description (optional field)
    "drCarr": 2023 // Career duration in years (optional field)
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

## Endpoints - Internship - Company (Tirocinio - Azienda)

### `POST /tirocini/azienda` - Create company

```java
/**
 * Creates a new company (ente) in the system and returns its generated
 * ID along with the associated teaching structure ID.
 *
 * @param body object (body, required) - company data containing:
 *               - tipoEnteCod  string - entity type code
 *               - provenienza  string - origin/source
 *               - des          string - company description
 *               - statoEnteCod string - entity status code
 *               - settAtecoId  long   - ATECO sector ID
 *               - catAtecoId   long   - ATECO category ID
 *               - duns         string - DUNS number
 *               - crmCod       string - CRM code
 *               - fatturato     string - revenue
 *               - link         string - website URL
 *               - user         string - user performing the operation
 *               - cod          string - company code
 * @return AziendaPostOut the generated entity ID and teaching structure ID,
 *         or 422 if parameters are invalid
 */
POST /tirocini/azienda
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "tipoEnteCod": "string", // Entity type code
  "provenienza": "string", // Origin/source
  "des": "string", // Company description
  "statoEnteCod": "string", // Entity status code
  "settAtecoId": 0, // ATECO sector ID
  "catAtecoId": 0, // ATECO category ID
  "duns": "string", // DUNS number
  "crmCod": "string", // CRM code
  "fatturato": "string", // Revenue
  "link": "string", // Website URL
  "user": "string", // User performing the operation
  "cod": "string" // Company code
}
```

#### Response

**`201 Created`**

```json
{
  "enteId": 123, // Generated entity ID
  "sdrId": 123 // Associated teaching structure ID
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

### `PUT /tirocini/azienda/{aziendaId}` - Update company

```java
/**
 * Updates the data of an existing company identified by aziendaId.
 *
 * @param aziendaId long   (path, required) - company ID to update
 * @param body      object (body, required) - updated company data containing:
 *                           - cod          string - company code
 *                           - des          string - company description
 *                           - statoEnteCod string - entity status code
 *                           - settAtecoId  long   - ATECO sector ID
 *                           - catAtecoId   long   - ATECO category ID
 *                           - duns         string - DUNS number
 *                           - crmCod       string - CRM code
 *                           - fatturato    string - revenue
 *                           - link         string - website URL
 *                           - user         string - user performing the operation
 * @return 200 if update succeeded, 404 if company not found,
 *         422 if parameters are invalid
 */
PUT /tirocini/azienda/{aziendaId}
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "cod": "string", // Company code
  "des": "string", // Company description
  "statoEnteCod": "string", // Entity status code
  "settAtecoId": 0, // ATECO sector ID
  "catAtecoId": 0, // ATECO category ID
  "duns": "string", // DUNS number
  "crmCod": "string", // CRM code
  "fatturato": "string", // Revenue
  "link": "string", // Website URL
  "user": "string" // User performing the operation
}
```

#### Response

**`200 OK`** - update succeeded, no body returned

**`404 Not Found`** - company not found

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

### `DELETE /tirocini/azienda/{aziendaId}` - Delete company

```java
/**
 * Permanently deletes a company identified by aziendaId.
 *
 * @param aziendaId long (path, required) - company ID to delete
 * @return 200 if deletion succeeded, 404 if company not found,
 *         422 if parameters are invalid
 */
DELETE /tirocini/azienda/{aziendaId}
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

#### Response

**`200 OK`** - deletion succeeded, no body returned

**`404 Not Found`** - company not found

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

## Endpoints - Internship - List of Available Contacts for a Given Company (Tirocinio - Lista dei contatti disponibili per una data azienda)

### `GET /tirocini/azienda/{aziendaId}/contatti` - Get company contacts

```java
/**
 * Returns the list of contacts associated with a specific company,
 * optionally filtered by name, fiscal code, active status, and role.
 *
 * @param aziendaId long   (path, required)  - company ID
 * @param cognome   string (query, optional) - contact last name
 * @param nome      string (query, optional) - contact first name
 * @param matCodfis string (query, optional) - contact student ID or fiscal code
 * @param attivoFlg int    (query, optional) - active status filter
 *                                             (1=active, 0=inactive)
 * @param ruolo     string (query, optional) - contact role
 * @return List<DatiContattiAzienda> list of contacts for the company,
 *         or an empty array if none match
 */
GET /tirocini/azienda/{aziendaId}/contatti
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "aziendaId": 123, // Company ID
    "contattoAziendaId": 123, // Contact ID
    "docenteId": 123, // Teacher ID (if contact is a teacher)
    "soggEstId": 123, // External subject ID
    "appellativo": "Dottore", // Title/salutation
    "cognome": "Rossi", // Last name
    "nome": "Mario", // First name
    "sesso": "M", // Gender (M/F)
    "matCodfis": "string", // Student ID or fiscal code
    "email": "string", // Email address
    "tel": "string", // Phone number
    "cellulare": "string", // Mobile number
    "attivoFlg": 1, // Active flag (1=active, 0=inactive)
    "ruolo": "string", // Role (e.g. Referente, Tutor, Responsabile)
    "dataNascita": "string", // Date of birth (dd/MM/yyyy)
    "nazioneNascita": "string", // Country of birth
    "comuneNascita": "string", // Municipality of birth
    "siglaNasc": "string", // Province of birth code
    "matricola": "string", // Student ID number
    "crmCod": "string", // CRM code
    "linguaInfoId": 123, // Language ID
    "linguaInfoDes": "string", // Language description
    "regioneAlbo": "string", // Professional register region
    "numIscrAlbo": "string", // Professional register number
    "dataIscrAlbo": "string" // Professional register enrollment date (dd/MM/yyyy)
  }
]
```

<br>

---

<br>

## Endpoints - Internship - List of Available Agreements for a Given Company (Tirocinio - Lista delle convenzioni disponibili per una data azienda)

### `GET /tirocini/azienda/{aziendaId}/convenzioni` - Get company agreements

```java
/**
 * Returns the list of agreements (convenzioni) associated with a specific
 * company, optionally filtered by description, status, dates, duration,
 * academic year, and default flag.
 *
 * @param aziendaId    long   (path, required)  - company ID
 * @param sdrCnvzDes   string (query, optional) - agreement description
 * @param statoCnvzCod string (query, optional) - agreement status code;
 *                                                 P=Proposta, I=Istituita,
 *                                                 X=Cessata, R=Rifiutata
 * @param dataInizio   string (query, optional) - agreement start date (dd/MM/yyyy,
 *                                                 exactly 10 chars)
 * @param dataFine     string (query, optional) - agreement end date; supports
 *                                                 date only (dd/MM/yyyy) or
 *                                                 datetime (dd/MM/yyyy hh:mm:ss)
 * @param durataAnni   int    (query, optional) - agreement duration in years
 * @param aaId         int    (query, optional) - academic year of validity
 * @param defaultFlg   int    (query, optional) - filter by default agreement flag;
 *                                                 used for dummy agreements linked
 *                                                 to opportunities that don't
 *                                                 require a formal agreement
 * @return List<DatiConvenzioniAzienda> list of agreements for the company,
 *         or an empty array if none match
 */
GET /tirocini/azienda/{aziendaId}/convenzioni
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "sdrCnvzId": 123, // Agreement structure ID
    "sdrCnvzDes": "string", // Agreement description
    "sdrAziendaId": 123, // Agreement company structure ID
    "aziendaId": 123, // Company ID
    "aziendaCod": "XXX", // Company code
    "aziendaDes": "string", // Company description
    "statoAziendaCod": "string", // Company status code
    "statoCnvzCod": "string", // Agreement status code (I/P/X/R)
    "statoCnvzDes": "string", // Agreement status description
    "ruoloCnvzCod": "string", // Agreement role code (A/C/P)
    "ruoloCnvzDes": "string", // Agreement role description
    "dataInizio": "string", // Start date (dd/MM/yyyy)
    "dataFine": "string", // End date (dd/MM/yyyy or dd/MM/yyyy hh:mm:ss)
    "dataDeposito": "string", // Deposit date (dd/MM/yyyy)
    "dataInvio": "string", // Send date (dd/MM/yyyy)
    "dataRestituzione": "string", // Return date (dd/MM/yyyy)
    "note": "string", // Notes
    "grpId": 0, // Group ID
    "livCod": "ATE", // Level code
    "livDes": "Ateneo", // Level description
    "grpLivDes": "string", // Group level description
    "durataAnni": 3, // Duration in years
    "tacitoRinnovoFlg": 1, // Tacit renewal flag (1=yes, 0=no)
    "numProtocollo": "string", // Protocol number
    "quadroFlg": 1, // Framework agreement flag (1=yes, 0=no)
    "aaId": 2018, // Academic year of validity
    "testoLiberoCnvz": "string", // Free text field
    "indirizzoSpedizione": "string", // Shipping address
    "defaultFlg": 1, // Default agreement flag (1=yes, 0=no)
    "stampaCnvzId": 0, // Print template ID
    "docCod": "ATE", // Document code
    "des": "string", // Description
    "tipoBolloCnvzCod": "string", // Stamp type code
    "tipoBolloCnvzDes": "string" // Stamp type description
  }
]
```

<br>

---

<br>

## Endpoints - Internship - List of Available Locations for a Given Company (Tirocinio - Lista delle sedi disponibili per una data azienda)

### `GET /tirocini/azienda/{aziendaId}/sedi` - Get company locations

```java
/**
 * Returns the list of locations (sedi) associated with a specific company,
 * optionally filtered by description, type, city, country, and active status.
 *
 * @param aziendaId      long   (path, required)  - company ID
 * @param sedeAziendaDes string (query, optional) - location description
 * @param tipoSedeCod    string (query, optional) - location type code;
 *                                                   LEG=Sede Legale,
 *                                                   OPE=Sede Operativa,
 *                                                   PER=Periferica
 * @param citta          string (query, optional) - city
 * @param nazioneId      long   (query, optional) - country ID
 * @param disattiva      int    (query, optional) - filter by deactivated status
 * @return List<DatiSediAzienda> list of locations for the company,
 *         or an empty array if none match
 */
GET /tirocini/azienda/{aziendaId}/sedi
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "sedeAziendaId": 123, // Location ID
    "aziendaId": 123, // Company ID
    "sedeAziendaDes": "string", // Location description
    "tipoSedeCod": "XXX", // Location type code (LEG/OPE/PER)
    "tipiSedeDes": "string", // Location type description
    "via": "string", // Street address
    "cap": "string", // Postal code
    "citta": "string", // City
    "provSigla": "string", // Province code
    "nazioneId": 123, // Country ID
    "nazioneDes": "string", // Country description
    "sedeNumTel": "string", // Phone number
    "sedeFax": "string", // Fax number
    "indirizzoCompleto": "string", // Full address
    "emailVisWeb": 1, // Email visible on web (1=yes, 0=no)
    "email": "string", // Email address
    "disattiva": 1, // Deactivated flag (1=yes, 0=no)
    "iataCod": "string", // IATA airport code
    "nomeAeroporto": "string" // Airport name
  }
]
```

<br>

---

<br>

## Endpoints - Internship - List of Available Companies (Tirocinio - Lista delle aziende disponibili)

### `GET /tirocini/aziende` - Get companies available for internships

```java
/**
 * Returns the list of companies available for internship assignments,
 * optionally filtered by code, description, fiscal code, VAT number,
 * type, status, DUNS code, and availability of active agreements
 * or opportunities.
 *
 * @param aziendaCod          string (query, optional) - company code
 * @param azienda             string (query, optional) - company description
 * @param cf                  string (query, optional) - company fiscal code
 * @param piva                string (query, optional) - company VAT number
 * @param pivaGruppo          string (query, optional) - group VAT number
 * @param tipoAziendaCod      string (query, optional) - company type code
 * @param statoAziendaCod     string (query, optional) - company status code;
 *                                                        A=Accreditato, B=Bozza,
 *                                                        BL=Blacklist, C=Cessato,
 *                                                        P=Proposta di accredito,
 *                                                        R=Accredito rifiutato
 * @param duns                string (query, optional) - 9-digit DUNS code
 * @param hasValidCnvz        int    (query, optional) - filter by active agreement
 *                                                        (1=has active agreement)
 * @param hasValidOpportunita int    (query, optional) - filter by active opportunity
 *                                                        (1=has active opportunity)
 * @return List<DatiAzienda> list of companies matching the filters,
 *         or an empty array if none match
 */
GET /tirocini/aziende
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "aziendaId": 123, // Company ID
    "aziendaCod": "XXX", // Company code
    "aziendaDes": "string", // Company description
    "cf": "string", // Fiscal code
    "piva": "string", // VAT number
    "pivaGruppo": "string", // Group VAT number
    "duns": "string", // DUNS code
    "tipoAziendaCod": "XXX", // Company type code
    "tipoAziendaDes": "string", // Company type description
    "settAziendaCod": "XXX", // Company sector code
    "settAziendaDes": "string", // Company sector description
    "privatoFlg": 1, // Private entity flag (1=yes, 0=no)
    "link": "string", // Website URL
    "sdrId": 123, // Teaching structure ID
    "tipoSdrCod": "XXX", // Teaching structure type code
    "tipoSdrDes": "string", // Teaching structure type description
    "sdrCod": "XXX", // Teaching structure code
    "sdrDes": "string", // Teaching structure description
    "statoAziendaCod": "string", // Company status code
    "statoAziendaDes": "string", // Company status description
    "provenienza": "string", // Origin/source (e.g. CLI, WEB)
    "fasciaDipCod": "XXX", // Employee range code
    "fasciaDipDes": "string", // Employee range description
    "assCatFlg": 1, // Category association flag (1=yes, 0=no)
    "assCatAziendaId": 123, // Associated category company ID
    "assCatAziendaCod": "XXX", // Associated category company code
    "assCatAziendaDes": "string", // Associated category company description
    "desEstesa": "string", // Extended description
    "autPrivacyFlg": 1, // Privacy authorization flag (1=yes, 0=no)
    "gruppoAppart": "string", // Group membership
    "codiceAssociativo": "XXX", // Associative code
    "fatturato": "string", // Revenue
    "settAtecoId": 123, // ATECO sector ID
    "settAtecoCod": "XXX", // ATECO sector code
    "settAtecoDes": "string", // ATECO sector description
    "profiloAziendaId": "string", // Company profile ID (1=Base, 2=Premium)
    "profiloAziendaDes": "string", // Company profile description
    "catAtecoId": 123, // ATECO category ID
    "catAtecoDes": "string", // ATECO category description
    "profiloPermessiId": 123, // Permissions profile ID
    "profiloPermessiDes": "string", // Permissions profile description
    "profiloPermessiPadreId": 123, // Parent permissions profile ID
    "oppEvidenzaFlg": 1, // Featured opportunity flag (1=yes, 0=no)
    "crmCod": "XXX", // CRM code
    "associazioneImprenditoriale": "string", // Business association
    "vincIniStageCod": "XXX", // Stage start constraint code
    "vincIniStageDes": "string", // Stage start constraint description
    "respPtaId": 123, // PTA responsible ID
    "respPtaCognome": "Rossi", // PTA responsible last name
    "respPtaNome": "Mario", // PTA responsible first name
    "crmSyncFlg": 1, // CRM sync flag (1=yes, 0=no)
    "regAziendaId": 123, // Company registry ID
    "notaInterna": "string", // Internal note
    "prodotti": "string", // Products
    "lingueLavoro": "string", // Working languages
    "lingueLavoroGruppo": "string", // Group working languages
    "tipoSelCod": "XXX", // Selection type code
    "tipoSelDes": "string", // Selection type description
    "contrAziendaCod": "XXX", // Company contract code
    "contrAziendaDes": "string", // Company contract description
    "convenzEsse3Pa": 1, // ESSE3-PA agreement flag (1=yes, 0=no)
    "dataIniConvenzEsse3Pa": "string", // ESSE3-PA agreement start (dd/MM/yyyy)
    "dataFinConvenzEsse3Pa": "string", // ESSE3-PA agreement end (dd/MM/yyyy)
    "schedaAccId": 123, // Accreditation form ID
    "schedaAccCod": "XXX", // Accreditation form code
    "schedaAccDes": "string", // Accreditation form description
    "notaAzienda": "string", // Company note
    "iataCod": "XXX", // IATA airport code
    "nomeAeroporto": "string", // Airport name
    "hasValidCnvz": 1, // Has active agreement (1=yes, 0=no)
    "hasValidOpportunita": 1 // Has active opportunity (1=yes, 0=no)
  }
]
```

<br>

---

<br>

## Endpoints - Internship - Check if a Student is Eligible for the Given Internship Type (Tirocinio - Check che uno studente sia eligibile per il tipo di stage passato)

### `GET /tirocini/checkEligibilitaStageStu` - Check student stage eligibility

```java
/**
 * Checks whether a student is eligible for a specific stage type,
 * based on their student ID, fiscal code, and other parameters.
 * Returns an outcome code and description for each service type checked.
 *
 * @param codFisc      string (query, required) - student fiscal code
 * @param codLingua    array  (query, required) - language code(s) for the response
 * @param matricola    string (query, optional) - student ID number
 * @param tipoServizio array  (query, optional) - service type(s) to check eligibility for
 * @param dataIniTiro  string (query, optional) - internship start date (dd/MM/yyyy,
 *                                                 exactly 10 chars); required for
 *                                                 extracurricular internships
 * @return List<DatiEligibilitaStageStu> eligibility check result per service type
 */
GET /tirocini/checkEligibilitaStageStu
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

### Eligibility outcome codes

- `100` - Service not enabled
- `101` - Service not enabled - tax payment irregularity
- `104` - Service not enabled - start date cannot fall more than 12 months after graduation
- `105` - Service not enabled - internship start date is before graduation date
- `106` - Service not enabled - student does not meet institution-configured requirements
- `107` - Service not enabled - student is not graduated
- `108` - Service not enabled - student does not have an active career
- `-101` - Start date not defined - required for extracurricular internships
- `-103` - Student ID does not match fiscal code
- `-106` - Student is graduated but career closure date is not registered
- `-107` - Service not enabled - internship start date has an invalid format
- `-200` - Generic service error

#### Response

**`200 OK`**

```json
[
  {
    "matricola": "string", // Student ID number
    "tipo_servizio": "string", // Service type checked (e.g. tirocinio_curriculare)
    "esito_cod": "string", // Outcome code (see codes above)
    "esito_des": "string" // Outcome description
  }
]
```

<br>

---

<br>

## Endpoints - Internship Import (Tirocini Import)

### `PUT /tirocini/import` - Import internship

```java
/**
 * Imports an internship record into the system. If the internship does not
 * exist it is created; if it already exists it is fully replaced via
 * deletion and re-insertion.
 *
 * @param body object (body, required) - internship data containing student,
 *                                       career, company, locations, tutors,
 *                                       and project details
 * @return 201 if import succeeded, 422 if parameters are invalid
 */
PUT /tirocini/import
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** none

::: warning
If the internship already exists, it is **fully replaced** - all existing data is deleted and re-inserted from scratch.
:::

#### Request body

```json
{
  "idTirocinio": 3715, // Internship ID
  "idCarriera": 1, // Student career ID
  "idTipoTirocinio": 1, // Internship type ID
  "tipoTirocinioDesc": "Curriculare", // Internship type description
  "codiceFiscale": "string", // Student fiscal code
  "matricola": "string", // Student ID number
  "nome": "string", // Student first name
  "cognome": "string", // Student last name
  "cfu": 5, // Credits assigned
  "codicione": "string", // Full internship code
  "annoCorso": 2, // Course year
  "idFacolta": 75207, // Faculty ID
  "facolta": "string", // Faculty description

  // Degree info
  "titoloDiStudioLauDip": 2, // Degree type ID
  "titoloDiStudioLauDipDesc": "string", // Degree type description
  "titoloDiStudioClasseAggr": "string", // Degree class aggregate code
  "titoloDiStudioClasseCodMinisteriale": "string", // Ministerial class code
  "titoloDiStudioClasseDesc": "string", // Degree class description
  "titoloDiStudioCorso": "string", // Degree course name
  "titoloDiStudioCodInterno": "string", // Internal degree code

  // Project dates
  "dataInizioProgettoFormativo": "string", // Project start date (dd/MM/yyyy)
  "dataFineProgettoFormativo": "string", // Project end date (dd/MM/yyyy)

  // Company info
  "nomeAzienda": "string", // Company name
  "partitaIvaAzienda": "string", // Company VAT number
  "codFiscAzienda": "string", // Company fiscal code
  "settoreAziendale": "string", // Business sector
  "codiceAteco": "string", // ATECO code
  "codiceAtecoDesc": "string", // ATECO code description
  "stabilimentoRepartoUfficio": "string", // Department/office

  // Legal address
  "sedeLegaleStato": 200, // Legal address country ID
  "sedeLegaleStatoDesc": "string", // Legal address country description
  "sedeLegaleProv": 37, // Legal address province ID
  "sedeLegaleProvDesc": "string", // Legal address province description
  "sedeLegaleComuneCodice": 37006, // Legal address municipality code
  "sedeLegaleComuneDesc": "string", // Legal address municipality description
  "sedeLegaleIndirizzo": "string", // Legal address street
  "sedeLegaleCap": "string", // Legal address postal code

  // Operational address
  "sedeOperativaStato": 200, // Operational address country ID
  "sedeOperativaStatoDesc": "string", // Operational address country description
  "sedeOperativaProv": 6, // Operational address province ID
  "sedeOperativaProvDesc": "string", // Operational address province description
  "sedeOperativaComuneCodice": 6001, // Operational address municipality code
  "sedeOperativaComuneDesc": "string", // Operational address municipality description
  "sedeOperativaIndirizzo": "string", // Operational address street
  "sedeOperativaCap": "string", // Operational address postal code

  // Company tutor
  "tutorAziendaleNome": "string", // Company tutor first name
  "tutorAziendaleCognome": "string", // Company tutor last name
  "tutorAziendaleEmail": "string", // Company tutor email
  "tutorAziendaleRuolo": "string", // Company tutor role
  "tutorAziendaleCompetenze": "string", // Company tutor competencies
  "tutorAziendaleInquadramento": "string", // Company tutor employment level

  // Academic tutor
  "tutorAccademicoNome": "string", // Academic tutor first name
  "tutorAccademicoCognome": "string", // Academic tutor last name
  "tutorAccademicoEmail": "string", // Academic tutor email
  "tutorAccademicoDipartimento": "string", // Academic tutor department
  "tutorAccademicoInquadramento": "string", // Academic tutor employment level

  // Project details
  "tirocinioDurata": "string", // Internship duration value
  "tirocinioDurataTipo": "ore", // Internship duration unit (e.g. ore)
  "oggettoTirocinio": "string", // Internship subject
  "obiettiviFormativi": "string", // Training objectives
  "attivita": "string" // Planned activities
}
```

#### Response

**`201 Created`** - import succeeded, no body returned

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

## Endpoints - Internship - List of Available Opportunities (Tirocinio - Lista delle opportunità disponibili)

### `GET /tirocini/opportunita` - Get internship opportunities

```java
/**
 * Returns the list of available internship opportunities based on the
 * applied filters. Supports filtering by company, sector, geography,
 * dates, duration, internship type, and more.
 *
 * @param azienda          string (query, optional) - company description
 * @param enteId           long   (query, optional) - external entity ID
 * @param tipoTirocCod     string (query, optional) - internship type code
 * @param testo            string (query, optional) - free text search on title,
 *                                                     description, or company name
 * @param title            string (query, optional) - text search on title only
 * @param descr            string (query, optional) - opportunity description
 * @param area             string (query, optional) - sector type code
 * @param areaDiscId       long   (query, optional) - disciplinary area ID for
 *                                                     a given agreement
 * @param settAreaDiscId   long   (query, optional) - sector linked to the area ID
 * @param areaGeograficaCod string (query, optional) - geographic area code
 * @param settore          long   (query, optional) - external entity economic
 *                                                     activity ID
 * @param settAtecoId      long   (query, optional) - ATECO sector ID
 * @param catAtecoId       long   (query, optional) - ATECO category ID
 * @param nazione          int    (query, optional) - country filter;
 *                                                     0=Italy, 1=Abroad, 2=All
 * @param nazioneId        long   (query, optional) - country ID
 * @param provCod          string (query, optional) - province code
 * @param campagnaId       long   (query, optional) - campaign ID
 * @param catProtettaFlg   int    (query, optional) - filter by protected categories;
 *                                                     allowed range: 0–1
 * @param esclOppCamp      int    (query, optional) - exclude campaign-linked
 *                                                     opportunities; allowed range: 0–1
 * @param reqCodFlg        int    (query, optional) - filter opportunities with
 *                                                     an associated SQL condition;
 *                                                     allowed range: 0–1
 * @param reqObiett        string (query, optional) - requirement text to search
 * @param visOppScadute    int    (query, optional) - include expired opportunities;
 *                                                     allowed range: 0–1
 * @param dataIniIscrDa    string (query, optional) - enrollment start lower bound
 *                                                     (dd/MM/yyyy, exactly 10 chars)
 * @param dataIniIscrA     string (query, optional) - enrollment start upper bound
 *                                                     (dd/MM/yyyy, exactly 10 chars)
 * @param dataFinIscrDa    string (query, optional) - enrollment end lower bound
 *                                                     (dd/MM/yyyy, exactly 10 chars)
 * @param dataFinIscrA     string (query, optional) - enrollment end upper bound
 *                                                     (dd/MM/yyyy, exactly 10 chars)
 * @param dataIniTiroDa    string (query, optional) - internship start lower bound
 *                                                     (dd/MM/yyyy, exactly 10 chars)
 * @param dataIniTiroA     string (query, optional) - internship start upper bound
 *                                                     (dd/MM/yyyy, exactly 10 chars)
 * @param durataDa         int    (query, optional) - duration lower bound in months
 * @param durataA          int    (query, optional) - duration upper bound in months
 * @return List<DatiOpportunita> list of matching opportunities,
 *         or an empty array if none match
 */
GET /tirocini/opportunita
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "titolo": "string", // Opportunity title
    "azienda": "string", // Company name
    "enteId": 123, // External entity ID
    "campagnaId": 123, // Campaign ID
    "tipoTirocCod": "XXX", // Internship type code
    "tipo": "string", // Internship type description
    "tirocDesPub": "string", // Public internship description
    "descrizione": "string", // Opportunity description
    "visWebFlg": 1, // Visible on web (1=yes, 0=no)
    "reqCodFlg": 1, // Has associated SQL condition (1=yes, 0=no)
    "categProtetteFlg": 1, // Protected categories flag (1=yes, 0=no)
    "area": "XXX", // Sector type code
    "areaGeograficaCod": "string", // Geographic area code
    "settore": 123, // Economic activity ID
    "settAtecoId": 123, // ATECO sector ID
    "catAtecoId": 123, // ATECO category ID
    "nazioneId": 123, // Country ID
    "dataIniIscr": "string", // Enrollment start date (dd/MM/yyyy)
    "dataFinIscr": "string", // Enrollment end date (dd/MM/yyyy)
    "dataIniTiro": "string", // Internship start date (dd/MM/yyyy)
    "durataMesi": 10, // Duration in months
    "p06SediEntiEstDes": "string", // Location description
    "tipoSedeCod": "XXX", // Location type code
    "tipoSedeDes": "string", // Location type description
    "p01NaziDes": "string", // Country description
    "p01ComuSigla": "string", // Municipality province code
    "p01ComuDes": "string", // Municipality description
    "p06SediEntiEstCap": "string", // Postal code
    "p06SediEntiEstCitstra": "string", // Foreign city name
    "p06SediEntiEstVia": "string", // Street address
    "sedePrefixInternaz": "string", // International prefix
    "sedeNumTel": "string", // Phone number
    "sedeFax": "string" // Fax number
  }
]
```

<br>

---

<br>

## Endpoints - Internship - Attachments (Tirocinio - Allegati)

### `POST /tirocini/{stuId}/allegati` - Insert attachment metadata

```java
/**
 * Inserts the metadata for a new attachment linked to a student's internship
 * application. The response includes a Location header pointing to the URL
 * for uploading the associated blob.
 *
 * @param stuId long   (path, required) - student career ID
 * @param body  object (body, required) - attachment metadata containing:
 *                - filename             string  - file name
 *                - autore               string  - author
 *                - titolo               string  - title
 *                - descrizione          string  - free text description
 *                - tipologiaAllegato    string  - attachment type code
 *                                                 (e.g. ACC_RIS)
 *                - validoFlg            int     - valid flag (1=yes, 0=no)
 *                - chiaviCollegamento   array   - link keys as name/value pairs;
 *                                                 use domTiroId to link to an
 *                                                 internship application
 *                - proprietaAggiuntive  array   - additional properties as
 *                                                 name/value objects supporting
 *                                                 alfa, numeric, and date values
 * @return 201 with Location header for blob upload,
 *         or 422 if parameters are invalid
 */
POST /tirocini/{stuId}/allegati
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** none

#### Request body

```json
{
  "filename": "readme.txt", // File name
  "autore": "mario rossi", // Author
  "titolo": "string", // Title
  "descrizione": "string", // Free text description
  "tipologiaAllegato": "ACC_RIS", // Attachment type code
  "validoFlg": 1, // Valid flag (1=yes, 0=no)
  "chiaviCollegamento": [
    // Link keys
    {
      "nome": "domTiroId", // Key name (use domTiroId to link to application)
      "valore": 123 // Key value
    }
  ],
  "proprietaAggiuntive": [
    // Additional properties
    {
      "nome": "string", // Property name
      "valAlfa": "string", // Alphanumeric value
      "valNum": 1, // Numeric value
      "valDate": "string" // Date value (dd/MM/yyyy hh:mm:ss)
    }
  ]
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

### `GET /tirocini/{stuId}/allegati/{allegatoId}/blob` - Download attachment blob

```java
/**
 * Returns the binary content (blob) of a specific attachment linked
 * to a student's internship application.
 *
 * @param stuId      long (path, required) - student career ID
 * @param allegatoId long (path, required) - attachment upload ID
 * @return binary file content as application/octet-stream,
 *         or 422 if parameters are invalid
 */
GET /tirocini/{stuId}/allegati/{allegatoId}/blob
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`** - `application/octet-stream` - binary file content

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

## Endpoints - Internship - Internship Applications (Tirocinio - Domande di tirocinio)

### `GET /tirocini/{stuId}/domande` - Get student internship application headers

```java
/**
 * Returns the list of internship application headers (testate) for a specific
 * student career. If no status filter is provided, defaults to returning
 * applications in PRE, CON, and AVV states.
 *
 * @param stuId          long         (path, required)  - student career ID
 * @param statoDomTiroCod array<string> (query, optional) - application status
 *                                                          filter; PRE=Presentata,
 *                                                          CON=Confermata,
 *                                                          AVV=Avviato,
 *                                                          CHI=Chiusa,
 *                                                          ANN=Annullata,
 *                                                          RIF=Rifiutata,
 *                                                          NAS=Non assegnato;
 *                                                          defaults to PRE+CON+AVV
 * @param fields         string       (query, optional) - comma-separated list of
 *                                                          optional fields to include;
 *                                                          use ALL for all fields;
 *                                                          supports Ant Glob Patterns
 *                                                          (e.g. childObj.prop1,
 *                                                          childObj.*, childObj.**)
 * @param order          string       (query, optional) - sort order; prefix + (ASC)
 *                                                          or - (DESC) followed by
 *                                                          field name; multiple fields
 *                                                          comma-separated
 *                                                          (e.g. +aaId,-tipoTirocCod)
 * @return List<TestataDomandaDiTirocinio> list of internship application headers,
 *         or an empty array if none match
 */
GET /tirocini/{stuId}/domande
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "domTiroId": 123, // Application ID (primary key)
    "stuId": 123, // Student career ID
    "domTiroPrg": 123, // Application progressive number
    "aaId": 123, // Academic year ID
    "desAa": "2017/2018", // Academic year description
    "cdsId": 123, // Degree course ID
    "aaOrdId": 123, // Curriculum academic year ID
    "pdsId": 123, // Study plan ID
    "tipoTirocCod": "JOB", // Internship type code
    "tipoTirocDes": "string", // Internship type description
    "desEstesa": "string", // Extended description
    "statoDomTiroCod": "PRE", // Application status code
    "statoDomTiroDes": "string", // Application status description
    "candVisEnteFlg": 1, // Candidate visible to company (1=yes, 0=no)
    "abilRicCfu": 1, // CFU recognition enabled (1=yes, 0=no)
    "enteId": 123, // External entity ID
    "enteDes": "string", // External entity description
    "duns": "string", // DUNS code
    "piva": "string", // VAT number
    "cf": "string", // Fiscal code
    "sdrId": 123, // Teaching structure ID
    "numProtocollo": "string", // Protocol number
    "cnvzDes": "string", // Agreement description
    "sdrCnvzId": 123, // Agreement teaching structure ID
    "oppTitolo": "string", // Opportunity title
    "oppDes": "string" // Opportunity description
  }
]
```

<br>

---

<br>

## Endpoints - Internship - Internship Application Details (Tirocinio - Dettaglio domanda di tirocinio)

### `GET /tirocini/{stuId}/domande/{domTiroId}` - Get internship application detail

```java
/**
 * Returns the full details of a specific internship application for a student,
 * including agreement info, tutors, project form status, duration, activities,
 * and training objectives.
 *
 * @param stuId      long   (path, required)  - student career ID
 * @param domTiroId  long   (path, required)  - internship application ID
 * @param fields     string (query, optional) - comma-separated list of optional
 *                                              fields to include; use ALL for all
 *                                              fields; supports Ant Glob Patterns
 *                                              (e.g. childObj.prop1,
 *                                              childObj.*, childObj.**)
 * @return DettaglioDomandaDiTirocinio full application details,
 *         or 404 if not found
 */
GET /tirocini/{stuId}/domande/{domTiroId}
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
{
  "domTiroId": 12345, // Application ID (primary key)
  "domTiroPrg": 1234, // Application progressive number
  "stuId": 12, // Student career ID
  "cdsId": 123, // Degree course ID
  "aaOrdId": 123, // Curriculum academic year ID
  "pdsId": 123, // Study plan ID
  "sdrId": 123, // Teaching structure ID
  "numProtocollo": "string", // Protocol number
  "cnvzDes": "string", // Agreement description
  "sdrCnvzId": 123, // Agreement teaching structure ID
  "dataIniCnvz": "string", // Agreement start date (dd/MM/yyyy)
  "dataFinCnvz": "string", // Agreement end date (dd/MM/yyyy)
  "defaultFlg": 1, // Default agreement flag (1=yes, 0=no)
  "oppTitolo": "string", // Opportunity title
  "oppDes": "string", // Opportunity description
  "oppSede": "string", // Opportunity location

  // Period and schedule
  "tipoPeriodoCod": "1SEM", // Period type code
  "tipoPeriodoDes": "string", // Period type description
  "dataIniTiro": "string", // Internship start date (dd/MM/yyyy)
  "dataFinTiro": "string", // Internship end date (dd/MM/yyyy)
  "orarioPrevisto": "string", // Expected schedule

  // Duration
  "durataOre": 10, // Duration in hours
  "durataEffettiva": 10, // Actual duration
  "durataMesi": 10, // Duration in months
  "durataSett": 10, // Duration in weeks
  "durataGiorni": 10, // Duration in days
  "numGiorniTiroSett": 10, // Internship days per week

  // Tutors
  "respUffCognome": "string", // Office responsible last name
  "respUffNome": "string", // Office responsible first name
  "tutDoceId": 123, // Academic tutor ID
  "tutDoceMatricola": "string", // Academic tutor ID number
  "tutDoceCognome": "string", // Academic tutor last name
  "tutDoceNome": "string", // Academic tutor first name
  "tutSoggId": 123, // Company tutor external subject ID
  "tutSoggCodFis": "string", // Company tutor fiscal code
  "tutSoggCognome": "string", // Company tutor last name
  "tutSoggNome": "string", // Company tutor first name
  "delTutMatricola": "string", // Delegate tutor ID number
  "delTutCognome": "string", // Delegate tutor last name
  "delTutNome": "string", // Delegate tutor first name

  // Stage type and sector
  "tipoStageCod": "string", // Stage type code
  "tipiStageDes": "string", // Stage type description
  "areeSettId": 123, // Sector area ID
  "areeSettDes": "string", // Sector area description
  "areaDes": "string", // Area description

  // CFU and final evaluation
  "abilRicCfu": 1, // CFU recognition enabled (1=yes, 0=no)
  "abilValfin": 1, // Final evaluation enabled (1=yes, 0=no)
  "dataIniValfin": "string", // Final evaluation start date (dd/MM/yyyy)
  "dataFinValfin": "string", // Final evaluation end date (dd/MM/yyyy)
  "numGgIniValfin": 10, // Days from start for final evaluation open
  "numGgFinValfin": 10, // Days from end for final evaluation close

  // Mid-term evaluation
  "abilValmt": 1, // Mid-term evaluation enabled (1=yes, 0=no)
  "dataIniValmt": "string", // Mid-term evaluation start date (dd/MM/yyyy)
  "dataFinValmt": "string", // Mid-term evaluation end date (dd/MM/yyyy)
  "numGgIniValmt": 10, // Days from start for mid-term evaluation open
  "numGgFinValmt": 10, // Days from end for mid-term evaluation close

  // Final report
  "abilRelfin": 1, // Final report enabled (1=yes, 0=no)
  "dataIniRelfin": "string", // Final report start date (dd/MM/yyyy)
  "dataFinRelfin": "string", // Final report end date (dd/MM/yyyy)
  "numGgIniRelfin": 10, // Days from start for final report open
  "numGgFinRelfin": 10, // Days from end for final report close

  // Project form (PF) status
  "statoPfCod": "DC", // Project form status code
  "pfDes": "string", // Project form status description
  "pfAccStu": 1, // Student accepted PF (1=yes, 0=no)
  "dataPfAccStu": "string", // Date student accepted PF (dd/MM/yyyy)
  "pfAccAzienda": 1, // Company accepted PF (1=yes, 0=no)
  "dataPfAccAzienda": "string", // Date company accepted PF (dd/MM/yyyy)
  "accManleva": 1, // Waiver accepted (1=yes, 0=no)
  "dataAccManleva": "string", // Date waiver accepted (dd/MM/yyyy)

  // Signatory
  "firmCognome": "string", // Signatory last name
  "firmNome": "string", // Signatory first name
  "firmRuolo": "string", // Signatory role

  // Company info
  "fasciaAddettiStageCod": "string", // Employee range code
  "fasciaDes": "string", // Employee range description
  "numMaxStagisti": 10, // Max number of interns
  "numAddetti": 10, // Number of employees
  "numTirocinanti": 10, // Number of current interns
  "numTirocinantiExtcurr": 10, // Number of extracurricular interns
  "numTiroTutCurr": 10, // Curricular interns per tutor
  "numTiroTutExtcurr": 10, // Extracurricular interns per tutor
  "contattiAmmCognome": "string", // Administrative contact last name
  "contattiAmmNome": "string", // Administrative contact first name
  "tipiInsLavId": 123, // Employment type ID
  "insLavDes": "string", // Employment type description

  // Training content (student view)
  "attSvolteDes": "string", // Activities to be carried out
  "competenzeAcqDes": "string", // Competencies to be acquired
  "contFormGen": "string", // General training content
  "contFormSpec": "string", // Specific training content
  "contFormazione": "string", // Training content
  "facilitazioni": "string", // Facilitations
  "obiettFormDes": "string", // Training objectives
  "compAttese": "string", // Expected competencies
  "modVerifApprend": "string", // Learning verification method
  "numOreFormGen": 10, // General training hours
  "numOreFormSpec": 10, // Specific training hours

  // Training content (tutor view)
  "obiettFormDesTut": "string", // Tutor training objectives
  "attSvolteDesTut": "string", // Tutor activities description
  "compAtteseTut": "string", // Tutor expected competencies
  "competenzeAcqDesTut": "string", // Tutor competencies to be acquired
  "contFormGenTut": "string", // Tutor general training content
  "contFormSpecTut": "string", // Tutor specific training content
  "contFormazioneTut": "string", // Tutor training content
  "modVerifApprendTut": "string" // Tutor learning verification method
}
```

<br>

---

<br>

## Endpoints - Internship - Attachments Associated with the Internship Application (Tirocinio - Allegati associati alla domanda di tirocinio)

### `GET /tirocini/{stuId}/domande/{domTiroId}/allegati` - Get internship application attachments

```java
/**
 * Returns the list of attachments associated with a specific internship
 * application for a student.
 *
 * @param stuId     long   (path, required)  - student career ID
 * @param domTiroId long   (path, required)  - internship application ID
 * @param fields    string (query, optional) - comma-separated list of optional
 *                                             fields to include; use ALL for all
 *                                             fields; supports Ant Glob Patterns
 *                                             (e.g. childObj.prop1,
 *                                             childObj.*, childObj.**)
 * @param filter    string (query, optional) - RSQL filter expression applied
 *                                             after data retrieval
 * @return List<AllegatiDomandaTirocinio> list of attachments for the application,
 *         or an empty array if none are found
 */
GET /tirocini/{stuId}/domande/{domTiroId}/allegati
```

**Auth:** `UTENTE_TECNICO` · `STUDENTE` (at least one required) · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "domTiroId": 12, // Application ID (primary key)
    "allegatoId": 1, // Attachment ID (primary key)
    "stuId": 12, // Student career ID
    "dimensione": 10, // File size
    "titolo": "string", // Title
    "des": "string", // Description
    "filename": "string", // File name
    "grpId": 12, // Group ID
    "userMod": "string", // Last modified by
    "dataMod": "string", // Last modification date (dd/MM/yyyy)
    "userInsId": "string", // Inserted by
    "isOwner": 1, // Ownership flag (1=owner, 0=not owner)
    "tipoAllegatoCod": "LA" // Attachment type code
  }
]
```

<br>

---

<br>

## Endpoints - Internship - Details of the Evaluation Form Completed by the Student (Tirocinio - Dettaglio scheda di valutazione compilata da studente)

### `GET /tirocini/{stuId}/valutazioni/{domTiroId}` - Get student evaluation form

```java
/**
 * Returns the evaluation form filled in by a student for a specific internship
 * application. The response follows the standard questionnaire format where
 * each row represents either a question (Q_DOMANDA) or a possible answer
 * (Q_RISPOSTA). If the student selected an answer, the rispostaId field will
 * be populated. Sort by ordVis to get questions and answers in the correct order.
 *
 * @param stuId        long         (path, required)  - student career ID
 * @param domTiroId    long         (path, required)  - internship application ID
 * @param tipoQuestCod array<string> (query, optional) - evaluation type code(s)
 *                                                        to filter by (e.g. VF, RF, MT)
 * @param order        string       (query, optional) - sort order; prefix + (ASC)
 *                                                        or - (DESC) followed by field
 *                                                        name; use +ordVis to get
 *                                                        correct question/answer order
 * @return List<DatiQuestDomTiro> evaluation form rows for the application
 */
GET /tirocini/{stuId}/valutazioni/{domTiroId}
```

**Auth:** `UTENTE_TECNICO` required · Supported: `Basic`, `JWT`

**Cache:** `midRefreshRateUserIndependent` - medium-frequency resource, HTTP cache and server cache enabled

#### Response

**`200 OK`**

```json
[
  {
    "stuId": 12, // Student career ID
    "domTiroId": 12, // Application ID (primary key)
    "matricola": "123456", // Student ID number
    "cognomeStu": "Rossi", // Student last name
    "nomeStu": "Mario", // Student first name

    // Questionnaire header
    "tipoQuestCod": "string", // Evaluation type code (VF/RF/MT)
    "completoFlg": 1, // Completed flag (1=yes, 0=no)
    "dataIns": "string", // Insertion date (dd/MM/yyyy)
    "dataFineComp": "string", // Completion date (dd/MM/yyyy)
    "compCod": "string", // Compiler code (STU/TUT/DEL)
    "destCod": "string", // Destination code (STU/TUT/DEL)
    "questionarioId": 12, // Questionnaire ID
    "questCompId": 12, // Compiled questionnaire ID
    "questionarioCod": "string", // Questionnaire code
    "statoQuestCod": "string", // Questionnaire status (A=Attivo, B=Bozza)
    "questionarioDes": "string", // Questionnaire description
    "questionarioNote": "string", // Questionnaire notes
    "questContCod": "string", // Questionnaire context code
    "questContDes": "string", // Questionnaire context description
    "questDataIns": "string", // Questionnaire insertion date (dd/MM/yyyy)
    "questDataMod": "string", // Questionnaire modification date (dd/MM/yyyy)

    // Question/answer row
    "quesitoId": 12, // Question ID
    "elemCod": "string", // Element code
    "parentQuesitoId": 12, // Parent question ID
    "tipoElemCod": "string", // Element type (Q_DOMANDA or Q_RISPOSTA)
    "tipoFormatoCod": "string", // Format type code
    "tipoFormatoDes": "string", // Format type description
    "elemDes": "string", // Question text or answer alternative text
    "elemNota": "string", // Element note
    "ordVis": "string", // Display order (sort by this field)
    "quesitoPunteggio": 0, // Question score
    "obbligatorioFlg": 1, // Mandatory flag (1=yes, 0=no)
    "quesitoNote": "string", // Question notes
    "tagCod": "string", // Tag code
    "categCod": "string", // Category code
    "quesitoContCod": "string", // Question context code

    // Selected answer (populated if student answered)
    "rispostaId": 12, // Selected answer ID (null if not answered)
    "testoLibero": "string", // Free text answer
    "rispostaPunteggio": 0, // Answer score
    "rispostaDataIns": "string", // Answer insertion date (dd/MM/yyyy)
    "rispostaDataMod": "string" // Answer modification date (dd/MM/yyyy)
  }
]
```

---

## References

- **Swagger UI:** [Tirocini Api V1 - ESSE3 REST Docs](<https://unimol.esse3.cineca.it/e3rest/docs/?urls.primaryName=Tirocini%20Api%20V1%20(https%3A%2F%2Funimol.esse3.cineca.it%2Fe3rest%2Fapi%2Ftirocini-service-v1)#/>)
- **Spec YAML:** [p01-tirociniApiV1.yaml](https://unimol.esse3.cineca.it/e3rest/api/swagger-service-v1/swagger/specs/p01-tirociniApiV1.yaml)
- **ESSE3 REST API General Documentation:** [wiki.u-gov.it](https://wiki.u-gov.it/confluence/display/ESSE3/Servizi+REST+su+ESSE3)

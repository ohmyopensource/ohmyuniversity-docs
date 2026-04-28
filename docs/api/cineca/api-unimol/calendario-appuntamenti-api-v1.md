---
title: Calendario Appuntamenti API V1 | OhMyUniversity!
description: REST API documentation for the Calendario Appuntamenti service (calendario-app-service-v1) - appointment calendar management in CINECA ESSE3.
head:
  - - meta
    - property: og:title
      content: Calendario Appuntamenti API V1 | OhMyUniversity!
  - - meta
    - property: og:description
      content: REST API documentation for the Calendario Appuntamenti service (calendario-app-service-v1) - appointment calendar management in CINECA ESSE3.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/cineca/api-unimol/calendario-appuntamenti-api-v1
  - - meta
    - name: keywords
      content: calendario appuntamenti api, appointment calendar api, esse3 rest api, cineca api, ohmyuniversity api, prenotazione appuntamento, turni calendario
  - - meta
    - name: twitter:title
      content: Calendario Appuntamenti API V1 | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: REST API documentation for the Calendario Appuntamenti service (calendario-app-service-v1) - appointment calendar management in CINECA ESSE3.
---

# OhMyUniversity! - Unimol: Calendario Appuntamenti API V1

**ENG:** `Appointment Calendar`

**Version:** `1.0.0` · **Base URL:** `/calendario-app-service-v1`

REST API for managing appointment calendars in ESSE3, including calendar retrieval by context, slot browsing, and booking management (create, update, cancel).

---

## Changelog

| Version | ESSE3 Release | Changes                                                                                                     |
| ------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 20.01.02.00   | Added `GET /calendari/contesti/{contestoCalendario}` - retrieve calendars for a context                     |
| 1.0.0   | 20.01.02.00   | Added `GET /calendari/turni/{codTipoCalendario}` - retrieve slots for a calendar                            |
| 1.0.0   | 20.01.02.00   | Added `GET /calendari/contesti/{contestoCalendario}/appuntamenti/{persId}` - retrieve bookings for a person |
| 1.0.0   | 20.01.02.00   | Added `POST /calendari/appuntamenti/{persId}` - book an appointment                                         |
| 1.0.0   | 20.01.02.00   | Added `PUT /calendari/appuntamenti/{persId}/{appId}` - update a booking                                     |
| 1.0.0   | 20.01.02.00   | Added `DELETE /calendari/appuntamenti/{persId}/{appId}` - cancel a booking                                  |

---

## Endpoints - Appointments (Appuntamenti)

## Endpoints - Calendars (Calendari)

---

## References

- **Swagger UI:** [Calendario Appuntamenti Api V1 - ESSE3 REST Docs](<https://unimol.esse3.cineca.it/e3rest/docs/?urls.primaryName=Calendario%20Appuntamenti%20Api%20V1%20(https%3A%2F%2Funimol.esse3.cineca.it%2Fe3rest%2Fapi%2Fcalendario-app-service-v1)>)
- **Spec YAML:** [p19-calendarioAppuntamentiApiV1.yaml](https://unimol.esse3.cineca.it/e3rest/api/swagger-service-v1/swagger/specs/p19-calendarioAppuntamentiApiV1.yaml)
- **ESSE3 REST API General Documentation:** [wiki.u-gov.it](https://wiki.u-gov.it/confluence/display/ESSE3/Servizi+REST+su+ESSE3)

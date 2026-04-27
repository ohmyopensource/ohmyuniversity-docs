---
title: API Index | OhMyUniversity!
description: Comprehensive index of all API sources used in the OhMyUniversity! ecosystem, including endpoints, authentication methods, rate limits, and integration status.
head:
  - - meta
    - property: og:title
      content: API Index | OhMyUniversity!
  - - meta
    - property: og:description
      content: Explore the full list of API sources integrated in OhMyUniversity!, with details on endpoints, authentication, rate limits, and current status.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/components/badge
  - - meta
    - name: keywords
      content: ohmyuniversity api, university api index, cineca ans api, mim open data api, european data portal api, student data api, university integration, api documentation
  - - meta
    - name: twitter:title
      content: API Index | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Full overview of APIs used in OhMyUniversity!, including endpoints, authentication methods, and integration status.
---

# OhMyUniversity! - API Index

Overview of all API sources documented in this repository. Update this table whenever a source is add or modified.

| Source                                | Base URL                                                  | Auth               | Rate limit  | Status | Last updated |
| ------------------------------------- | --------------------------------------------------------- | ------------------ | ----------- | ------ | ------------ |
| CINECA ANS                            | `https://<university>.esse3.cineca.it/e3rest/docs`        | Bearer token       | Public      | active | -            |
| MIM (Ministero Istruzione) / OpenData | `https://dati.istruzione.it/opendata/esploraidati/`       | N/A                | N/A         | active | -            |
| MUR (Università - dati pubblici)      | `https://dati-ustat.mur.gov.it/api/3/action/package_list` | CKAN API standard  | N/A         | active | -            |
| European Data Portal                  | `https://data.europa.eu/en`                               | API Key (optional) | 100 req/min | active | 2024-03      |

### Status legend

- active - endpoints verified and working
- to be verified - documentation available but endpoints not recently tested
- deprecated - do not use, see the source changelog

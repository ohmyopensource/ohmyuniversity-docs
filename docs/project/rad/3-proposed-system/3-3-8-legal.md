---
title: RAD - 3.3.8 Legal | OhMyUniversity!
description: Legal requirements of OhMyUniversity! - defining data protection obligations, GDPR compliance constraints, and privacy governance for a platform handling academic and personal data.
head:
  - - meta
    - property: og:title
      content: RAD - 3.3.8 Legal | OhMyUniversity!
  - - meta
    - property: og:description
      content: Legal requirements of OhMyUniversity! - defining data protection obligations, GDPR compliance constraints, and privacy governance for a platform handling academic and personal data.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/rad/3-proposed-system/3-3-8-legal
  - - meta
    - name: keywords
      content: ohmyuniversity, rad, legal, nonfunctional requirements, gdpr, data protection, privacy, sensitive data, eu regulation, compliance, university app
  - - meta
    - name: twitter:title
      content: RAD - 3.3.8 Legal | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Legal requirements of OhMyUniversity! - defining data protection obligations, GDPR compliance constraints, and privacy governance for a platform handling academic and personal data.
---

# OhMyUniversity! - RAD: 3.3.8 Legal

The legal requirements define the compliance obligations that **OhMyUniversity!** must satisfy given the nature of the data it processes. As a platform handling academic records, personal identifiers, and other sensitive information pertaining to students, faculty, and staff, the system is subject to European data protection legislation and must treat legal compliance as a non-negotiable architectural constraint.

## GDPR Compliance

Data processing within **OhMyUniversity!** must comply with **EU Regulation 2016/679 (General Data Protection Regulation - GDPR)**. The following obligations apply throughout the design, development, and operation of the system:

- **Lawful basis for processing:** Every data processing activity must be grounded in one of the lawful bases defined by GDPR (e.g., fulfillment of a contract, compliance with a legal obligation, or explicit user consent). The applicable basis must be documented for each category of processed data.
- **Data minimization:** The system must collect and retain only the personal data strictly necessary for each processing purpose. Collection of data beyond what is functionally required is prohibited.
- **Purpose limitation:** Personal data collected for a specific purpose must not be reused for incompatible purposes without a renewed legal basis or explicit user consent.
- **Storage limitation:** Sensitive and personal data must be stored only for the duration necessary to fulfill the purpose for which it was collected. Retention periods must be defined, documented, and enforced through automated deletion or anonymization routines.
- **Data subject rights:** The system must support the rights granted to data subjects by GDPR, including the right to access, rectify, erase, and export their personal data. Mechanisms to fulfill these requests must be implemented and operable within the timeframes prescribed by the regulation.
- **Data breach notification:** The system must include mechanisms to detect, log, and report personal data breaches to the competent supervisory authority within 72 hours of becoming aware of the incident, in accordance with Article 33 of GDPR.

## Security Obligations

Legal compliance and data security are inseparable. The system must implement appropriate technical and organizational measures to protect personal data against unauthorized access, accidental loss, or destruction, as required by Article 32 of GDPR. Specific security constraints are detailed in section 3.3.6 (Security).

## Third-Party and Processor Obligations

Any third-party service or cloud provider (e.g., AWS) that processes personal data on behalf of the system must operate under a valid Data Processing Agreement (DPA) that meets GDPR requirements. The use of services that transfer personal data outside the European Economic Area is subject to the adequacy decisions and standard contractual clauses in force at the time of processing.

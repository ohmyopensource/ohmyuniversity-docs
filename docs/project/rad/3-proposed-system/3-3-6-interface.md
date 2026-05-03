---
title: RAD - 3-3-6 Interface | OhMyUniversity!
description: Interface requirements of OhMyUniversity - defining external API integration, secure communication, and digital identity authentication standards.
head:
  - - meta
    - property: og:title
      content: RAD - 3-3-6 Interface | OhMyUniversity!
  - - meta
    - property: og:description
      content: Interface requirements of OhMyUniversity - defining external API integration, secure communication, and digital identity authentication standards.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/rad/3-proposed-system/3-3-6-interface
  - - meta
    - name: keywords
      content: ohmyuniversity, rad, interface, nonfunctional requirements, external integration, api, cineca, esse3, moodle, tls, security, authentication, spid, cie, oidc, saml, university app
  - - meta
    - name: twitter:title
      content: RAD - 3-3-6 Interface | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Interface requirements of OhMyUniversity - defining external API integration, secure communication, and digital identity authentication standards.
---

# 3.3.6 Interface

The interface requirements define how **OhMyUniversity!** must communicate with external systems and authentication providers. Since the platform acts as a middleware between the user and university services, external integrations must be controlled, secure, and compliant with institutional standards.

- **External Integration:** Communication with university webservices must occur exclusively through the APIs provided by Cineca/Esse3 and Moodle.

- **Security:** Every communication between client and backend must be protected using the TLS 1.3 protocol through an encrypted channel.

- **Authentication:** Access must support integration with national digital identity systems, SPID/CIE, according to standard AgID protocols, OIDC/SAML.
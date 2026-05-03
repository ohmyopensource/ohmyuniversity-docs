---
title: Moodle Changelog | OhMyUniversity!
description: Track updates, changes, and additions to Moodle API documentation within OhMyUniversity!.
head:
  - - meta
    - property: og:title
      content: Moodle Changelog | OhMyUniversity!
  - - meta
    - property: og:description
      content: View the complete changelog for Moodle documentation in OhMyUniversity!, including new university instances, updated endpoints, and platform notes.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/moodle/changelog
  - - meta
    - name: keywords
      content: moodle changelog, moodle documentation updates, moodle api changelog, ohmyuniversity moodle changelog
  - - meta
    - name: twitter:title
      content: Moodle Changelog | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Full changelog of Moodle documentation in OhMyUniversity!, tracking new instances, URL changes, and platform notes.
---

# OhMyUniversity! - Moodle: Changelog

This page tracks changes to the Moodle section of OhMyUniversity! documentation - including new university instances, updated URLs, corrections, and notes on platform-level changes relevant to integrators.

---

## Platform version reference

Moodle HQ releases major versions every six months (second Monday of May and November), with minor patch releases every two months. The table below summarises the recent release history relevant to the Web Services API and authentication layer:

| Version | Released      | LTS     | General support ends | Security support ends |
| ------- | ------------- | ------- | -------------------- | --------------------- |
| 5.1     | January 2026  | No      | October 2026         | April 2027            |
| 5.0     | November 2025 | No      | April 2026           | October 2026          |
| 4.5     | October 2024  | **Yes** | October 2025         | October 2027          |
| 4.4     | May 2024      | No      | April 2025           | December 2025         |
| 4.3     | November 2023 | No      | October 2024         | April 2025            |
| 4.2     | May 2023      | No      | April 2024           | October 2024          |
| 4.1     | November 2022 | **Yes** | December 2023        | December 2025         |
| 4.0     | May 2022      | No      | June 2023            | December 2023         |

The current LTS release is **Moodle 4.5**. The next LTS is planned for Moodle 5.3.

For the full release schedule, see [moodledev.io/general/releases](https://moodledev.io/general/releases).

---

## Documentation changelog

### 2025-01

**Initial release of the Moodle section.**

- Added [Overview](/api/moodle/overview) - platform architecture, Web Services API structure, protocol reference, and user roles
- Added [Authentication](/api/moodle/auth) - interactive login plugins (LDAP, OAuth2, SAML2, CAS, OpenID Connect), token-based API authentication, and integrator notes

**University instances added (initial list):**

Università di Bari, Bergamo, Bologna (+ 3 additional instances), Brescia, Cagliari, Calabria, Catania, Chieti-Pescara, Ferrara, Firenze (+ multiple instances), Genova, Insubria (CINECA SaaS), IUAV Venezia, Macerata, Messina (+ legacy instance), Milano, Milano-Bicocca, Molise, Napoli Federico II, Padova, Palermo, Parma (Elly), Pavia, Perugia, Pisa, Roma Tre, Roma La Sapienza, Roma Foro Italico (CINECA), Sassari, Siena, Torino, Trento, Trieste, Udine, Tuscia, Verona (+ 3 additional instances).

---

## Contributing

If you notice a broken URL, a missing instance, or a change in a university's Moodle configuration, please open a pull request on the [OhMyUniversity! repository](https://github.com/ohmyopensource/ohmyuniversity) with the relevant details and a source link.

---

## References

- **Moodle Releases:** [moodledev.io/general/releases](https://moodledev.io/general/releases)
- **Moodle official website:** [moodle.org](https://moodle.org)

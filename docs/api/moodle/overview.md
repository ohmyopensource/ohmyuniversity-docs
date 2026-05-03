---
title: Moodle Overview | OhMyUniversity!
description: Overview of Moodle as an open-source LMS platform, its Web Services API, and the list of Italian universities running Moodle documented in OhMyUniversity!.
head:
  - - meta
    - property: og:title
      content: Moodle Overview | OhMyUniversity!
  - - meta
    - property: og:description
      content: Overview of Moodle as an open-source LMS platform, its Web Services API, and the list of Italian universities running Moodle documented in OhMyUniversity!.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/api/moodle/overview
  - - meta
    - name: keywords
      content: moodle overview, moodle lms, moodle api, moodle web services, moodle università italiane, ohmyuniversity moodle
  - - meta
    - name: twitter:title
      content: Moodle Overview | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Overview of Moodle as an open-source LMS platform, its Web Services API, and the list of Italian universities running Moodle documented in OhMyUniversity!.
---

# OhMyUniversity! - Moodle Overview

This section documents the APIs and integrations available for universities running **Moodle** as their Learning Management System. Unlike Multiversity or CINECA ESSE3, Moodle is not tied to a single institution or group: each university operates its own independent instance, configured and maintained autonomously.

---

## What is Moodle?

**Moodle** (Modular Object-Oriented Dynamic Learning Environment) is the world's most widely deployed open-source LMS, written in PHP and first released in 2002 by Martin Dougiamas. It is now maintained by **Moodle HQ** (Moodle Pty Ltd, Perth, Australia) alongside a global community of developers and partners.

Moodle is the most common LMS choice among Italian public universities, used to deliver e-learning content — course materials, assignments, forums, quizzes — alongside traditional in-person teaching.

Key figures and facts:

- **License:** GNU GPL (open source)
- **First release:** 2002
- **Current LTS:** Moodle 4.5 (released October 2024; supported until October 2027)
- **Major releases:** every 6 months (May and November)
- **35+** plugin types; thousands of community plugins available
- **~1,000+** registered Italian university instances (opt-in stats, incomplete)

**Website:** [moodle.org](https://moodle.org)

---

## The Moodle Platform

Moodle is structured as a **core application surrounded by plugins**. The core provides shared infrastructure — access control, database abstraction, file management, forms, events — while feature-specific functionality (activities, authentication methods, enrolment, grading, reporting) is delivered through strongly-typed plugins. This makes each installation highly customisable: institutions can choose exactly which plugins to enable and how to configure them.

Each university in this documentation runs its own independent instance. There is no shared infrastructure between institutions — each deployment is fully autonomous in terms of configuration, plugins, authentication, and data. Instances are typically served at a subdomain of the institution's main domain, though URL patterns vary widely:

```
LMS Portal:  https://elearning.{university}.it/
             https://moodle.{university}.it/
             https://virtuale.{university}.it/
```

The platform provides, depending on each institution's configuration:

- **Video lectures and course content** — on-demand materials delivered through the course area
- **Assignments and quizzes** — online submission and automated or manual grading
- **Forums and messaging** — structured communication between students and teachers
- **Exam management** — online or supervised exam delivery (via dedicated plugins or additional instances)
- **Grade tracking** — student progress, gradebook, and transcripts

::: warning
Moodle has no central registry of institutions. The list below was compiled from public sources and reflects verified instances only. URLs may change over time — always check the institution's official website if a link is broken.
:::

---

## Universities Using Moodle

The table below lists the Italian universities known to run Moodle as their primary LMS, with direct links to their e-learning portals. Some universities run multiple Moodle instances for different purposes (teaching, exams, staff training, external users); where this is the case, only the main teaching instance is listed and additional instances are noted.

| University | Moodle URL | Notes |
| --- | --- | --- |
| Università degli Studi di Bari | [elearning.uniba.it](https://elearning.uniba.it/) | |
| Università degli Studi di Bergamo | [elearning.unibg.it](https://elearning.unibg.it/) | |
| Università degli Studi di Bologna | [virtuale.unibo.it](https://virtuale.unibo.it/) | Main teaching instance. Additional instances: [elearning-pl.unibo.it](https://elearning-pl.unibo.it/) (Post-Lauream), [elearning-pro.unibo.it](https://elearning-pro.unibo.it/) (Projects), [elearning-sicurezza.unibo.it](https://elearning-sicurezza.unibo.it/) (Safety) |
| Università degli Studi di Brescia | [elearning.unibs.it](https://elearning.unibs.it/) | |
| Università degli Studi di Cagliari | [elearning.unica.it](https://elearning.unica.it/) | |
| Università della Calabria | [elearning.unical.it](https://elearning.unical.it/) | |
| Università degli Studi di Catania | [elearning.unict.it](https://elearning.unict.it/) | |
| Università degli Studi "G. d'Annunzio" Chieti-Pescara | [elearning.unich.it](https://elearning.unich.it/) | |
| Università degli Studi di Ferrara | [elearning.unife.it](https://elearning.unife.it/) | |
| Università degli Studi di Firenze | [e-l.unifi.it](https://e-l.unifi.it/) | Main teaching instance. Multiple additional instances for exams, staff training, and lifelong learning |
| Università degli Studi di Genova | [elearning.unige.it](https://elearning.unige.it/) | |
| Università degli Studi dell'Insubria | [elearning.uninsubria.it](https://elearning.uninsubria.it/) | Hosted by CINECA as SaaS |
| Università IUAV di Venezia | [elearning.iuav.it](https://elearning.iuav.it/) | |
| Università degli Studi di Macerata | [elearning.unimc.it](https://elearning.unimc.it/) | |
| Università degli Studi di Messina | [moodle.unime.it](https://moodle.unime.it/) | Legacy instance at [moodle2.unime.it](https://moodle2.unime.it/) accessible read-only during A.Y. 2025/2026 |
| Università degli Studi di Milano | [moodle.unimi.it](https://moodle.unimi.it/) | Moodle used alongside the proprietary Ariel platform |
| Università degli Studi di Milano-Bicocca | [elearning.unimib.it](https://elearning.unimib.it/) | |
| Università degli Studi del Molise | [elearning.unimol.it](https://elearning.unimol.it/) | |
| Università degli Studi di Napoli Federico II | [elearning.unina.it](https://elearning.unina.it/) | |
| Università degli Studi di Padova | [moodle.unipd.it](https://moodle.unipd.it/) | Multiple instances organised by School/Department; see [unipd.it/elearning](https://www.unipd.it/elearning) |
| Università degli Studi di Palermo | [elearning.unipa.it](https://elearning.unipa.it/) | |
| Università degli Studi di Parma | [elly.unipr.it](https://elly.unipr.it/) | Branded as "Elly-Moodle"; multiple department portals |
| Università degli Studi di Pavia | [elearning.unipv.it](https://elearning.unipv.it/) | |
| Università degli Studi di Perugia | [elearning.unipg.it](https://elearning.unipg.it/) | |
| Università degli Studi di Pisa | [elearning.unipi.it](https://elearning.unipi.it/) | |
| Università degli Studi Roma Tre | [formonline.uniroma3.it](https://formonline.uniroma3.it/) | |
| Università degli Studi di Roma "La Sapienza" | [elearning.uniroma1.it](https://elearning.uniroma1.it/) | |
| Università degli Studi di Roma "Foro Italico" | [moodle.uniroma4.it](https://moodle.uniroma4.it/) | Managed by CINECA |
| Università degli Studi di Sassari | [elearning.uniss.it](https://elearning.uniss.it/) | |
| Università degli Studi di Siena | [elearning.unisi.it](https://elearning.unisi.it/) | Integrated within the USiena Integra platform |
| Università degli Studi di Torino | [moodle.unito.it](https://moodle.unito.it/) | Multiple instances; see [unito.it/node/2358](https://www.unito.it/node/2358) |
| Università degli Studi di Trento | [elearning.unitn.it](https://elearning.unitn.it/) | |
| Università degli Studi di Trieste | [moodle2.units.it](https://moodle2.units.it/) | |
| Università degli Studi di Udine | [elearning.uniud.it](https://elearning.uniud.it/) | Credentials shared with ESSE3 |
| Università degli Studi della Tuscia | [moodle.unitus.it](https://moodle.unitus.it/) | |
| Università degli Studi di Verona | [moodledidattica.univr.it](https://moodledidattica.univr.it/) | Main teaching instance. Additional instances: [esamionline.univr.it](https://esamionline.univr.it/) (exams), [moodleser.univr.it](https://moodleser.univr.it/) (staff), [moodleext.univr.it](https://moodleext.univr.it/) (external) |

> **Contributing:** If you know of a verified Moodle instance not listed here, open a pull request on the [OhMyUniversity! repository](https://github.com/ohmyopensource/ohmyuniversity) with the URL and a source link.

---

## References

- **Moodle official website:** [moodle.org](https://moodle.org)
- **Moodle Developer Resources:** [moodledev.io](https://moodledev.io)
- **Moodle Web Services documentation:** [moodledev.io/docs/apis/subsystems/external](https://moodledev.io/docs/apis/subsystems/external)
- **Moodle Releases:** [moodledev.io/general/releases](https://moodledev.io/general/releases)
- **Moodle registered sites (Italy):** [stats.moodle.org](https://stats.moodle.org/sites/index.php?country=IT) *(opt-in registry, incomplete)*

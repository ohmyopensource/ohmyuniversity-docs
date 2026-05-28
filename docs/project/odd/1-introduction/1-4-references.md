---
title: ODD - 1.4 References | OhMyUniversity!
description: Internal documents, style guides, and standards that inform the implementation and object design of OhMyUniversity.
head:
  - - meta
    - property: og:title
      content: ODD - 1.4 References | OhMyUniversity!
  - - meta
    - property: og:description
      content: References, style guides, and standards for the OhMyUniversity Object Design Document.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/odd/1-introduction/1-4-references
  - - meta
    - name: keywords
      content: ohmyuniversity, odd, references, google style guides, javadoc, standards, documentation
  - - meta
    - name: twitter:title
      content: ODD - 1.4 References | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Internal documents, style guides, and standards informing OhMyUniversity's codebase.
---

# OhMyUniversity! - ODD: 1.4 References

This section lists the internal project documents, programming style guides, and development standards that mandate the implementation details for OhMyUniversity!.

---

## Internal Documents

| Document                                 | Location            | Purpose                                                                                                                           |
| ---------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Requirements Analysis Document (RAD)** | `docs/project/rad/` | Definisce i requisiti funzionali a cui l'implementazione del codice deve rimanere pienamente allineata.                           |
| **System Design Document (SDD)**         | `docs/project/sdd/` | Delinea i sottosistemi ad alto livello, le strategie di persistenza e l'architettura globale su cui si basa il design ad oggetti. |

---

## Development Standards & Style Guides

Le implementazioni del codice, le regole di formattazione e le pratiche di documentazione delle interfacce si basano rigorosamente sui seguenti standard:

| Standard / Guide                  | Applicability                                                  | Reference                                                                                |
| --------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Google Java Style Guide**       | Linee guida strutturali per Java                               | https://google.github.io/styleguide/javaguide.html                                       |
| **Google TypeScript Style Guide** | Linee guida strutturali per TypeScript                         | https://google.github.io/styleguide/tsguide.html                                         |
| **Google JavaScript Style Guide** | Linee guida strutturali per JavaScript                         | https://google.github.io/styleguide/jsguide.html                                         |
| **Google HTML/CSS Style Guide**   | Linee guida strutturali per HTML/CSS                           | https://google.github.io/styleguide/htmlcssguide.html                                    |
| **Effective Dart**                | Linee guida strutturali per Dart                               | https://dart.dev/effective-dart                                                          |
| **GDPR (Article 32)**             | Conformità di sicurezza per l'implementazione del TTL in cache | Implementazione del Time-To-Live nei flussi dei dati esterni per limitare l'esposizione. |

---

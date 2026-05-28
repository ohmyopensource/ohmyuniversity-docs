---
title: ODD - 1.3 Definitions, Acronyms and Abbreviations | OhMyUniversity!
description: Glossary of object-oriented design terms, implementation patterns, and acronyms used in the OhMyUniversity ODD.
head:
  - - meta
    - property: og:title
      content: ODD - 1.3 Definitions, Acronyms and Abbreviations | OhMyUniversity!
  - - meta
    - property: og:description
      content: Definitions and acronyms for OhMyUniversity ODD to ensure clear communication across the development team.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/odd/1-introduction/1-3-definitions-acronyms
  - - meta
    - name: keywords
      content: ohmyuniversity, odd, definitions, acronyms, glossary, design patterns, dto, proxy pattern, javadoc
  - - meta
    - name: twitter:title
      content: ODD - 1.3 Definitions, Acronyms and Abbreviations | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Glossary of object-oriented terms and project-specific acronyms used in OhMyUniversity documentation.
---

# OhMyUniversity! - ODD: 1.3 Definitions, Acronyms and Abbreviations

This section clarifies terminology specific to the implementation, object-oriented design, and architectural patterns of OhMyUniversity!.

---

## Definitions (Object Design & Implementation)

### **Design Patterns & Strategies**

| Term                             | Definition                                                                                                                                                                                                                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Design by Contract**           | Una metodologia di progettazione software in cui ogni metodo pubblico espone un contratto chiaro formato da pre-condizioni, post-condizioni e invarianti di classe.                                                                                                                 |
| **Data Transfer Object (DTO)**   | Oggetti leggeri con strutture dati "piatte" utilizzati in specifici percorsi di accesso per evitare di attraversare strutture JSON annidate, ottimizzando così le performance di rendering.                                                                                         |
| **Lazy Loading / Eager Loading** | Strategie di gestione della memoria e della rete. I metadati leggeri vengono caricati in modo _eager_ (immediato), mentre i payload pesanti (come i contenuti delle lezioni) vengono caricati in modo _lazy_ (solo quando esplicitamente richiesti) per evitare latenza cumulativa. |
| **Object Composition**           | Principio di design fortemente preferito all'ereditarietà (Inheritance) per la modellazione dei ruoli e delle sessioni utente, permettendo di incapsulare comportamenti e permessi in componenti intercambiabili dinamicamente.                                                     |
| **Proxy Pattern**                | Pattern architetturale adottato dal sistema per implementare la strategia di Lazy Loading sulle risorse esterne.                                                                                                                                                                    |
| **Single Responsibility**        | Principio secondo il quale funzioni e metodi devono fare esattamente una singola cosa, facilitando la testabilità e la focalizzazione del codice.                                                                                                                                   |

### **Documentation & Development Terms**

| Term                               | Definition                                                                                                                                                                                                                                               |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Docstrings (es. Javadoc/JSDoc)** | Formato standard obbligatorio per documentare i componenti pubblici del sistema (pacchetti, classi, interfacce, metodi), che include tag specifici (es. `@param`, `@return`, `@throws`).                                                                 |
| **Magic Numbers**                  | Valori numerici o stringhe hardcoded inserite direttamente nel codice. L'uso di questi valori è strettamente vietato e devono essere sostituiti con costanti nominate e tipizzate.                                                                       |
| **Semantic Naming**                | Convenzione secondo cui i nomi di entità, classi e metodi devono essere autoesplicativi, descrivendo precisamente l'azione o l'entità (es. nomi come sostantivi per le classi e verbi per i metodi) evitando nomi generici come `data` o `processItems`. |

---

## Acronyms (Design & Architecture Context)

| Acronym   | Expansion                                     | Definition                                                                                                                                    |
| --------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **ACID**  | Atomicity, Consistency, Isolation, Durability | Proprietà garantite dai database relazionali (PostgreSQL) per massimizzare l'integrità dei dati generati nativamente.                         |
| **DTO**   | Data Transfer Object                          | Oggetto utilizzato per incapsulare e trasferire dati in strutture piatte.                                                                     |
| **JWT**   | JSON Web Token                                | Standard utilizzato per la gestione delle sessioni utente.                                                                                    |
| **ODD**   | Object Design Document                        | Documento che specifica il design object-oriented dettagliato del sistema e funge da linea guida per gli sviluppatori.                        |
| **RAD**   | Requirements Analysis Document                | Documento che contiene i requisiti a cui il codice base deve rimanere allineato.                                                              |
| **RDBMS** | Relational Database Management System         | Sistema di gestione di database relazionali (es. PostgreSQL) utilizzato per garantire l'integrità dei dati core.                              |
| **SDD**   | System Design Document                        | Documento che descrive i sottosistemi di alto livello, dal quale l'ODD eredita l'architettura per definire le strutture interne.              |
| **TTL**   | Time-To-Live                                  | Limite di tempo (impostato a 1 ora) applicato alla cache in memoria per i dati esterni sensibili, al fine di garantire la conformità al GDPR. |

---

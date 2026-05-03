---
title: Moodle Overview | OhMyUniversity!
description: Overview of Moodle as an LMS platform, its architecture, Web Services API, and how it is used by Italian universities documented in OhMyUniversity!.
head:
  - - meta
    - property: og:title
      content: Moodle Overview | OhMyUniversity!
  - - meta
    - property: og:description
      content: Overview of Moodle as an LMS platform, its architecture, Web Services API, and how it is used by Italian universities documented in OhMyUniversity!.
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
      content: Overview of Moodle as an LMS platform, its architecture, Web Services API, and how it is used by Italian universities documented in OhMyUniversity!.
---

# OhMyUniversity! - Moodle Overview

This section documents the APIs and integrations available for universities running **Moodle** as their Learning Management System. Unlike Multiversity or CINECA ESSE3, Moodle is not tied to a single institution or group: each university operates its own independent instance, configured and maintained autonomously.

---

## What is Moodle?

**Moodle** (Modular Object-Oriented Dynamic Learning Environment) is a free, open-source LMS written in PHP, first released in 2002 by Martin Dougiamas while working at Curtin University, Australia. It is now maintained by **Moodle HQ** (Moodle Pty Ltd, Perth, Australia) and a global community of developers and partners.

Moodle is one of the most widely adopted LMS platforms in the world, and the most common choice among Italian public universities for delivering e-learning content alongside traditional in-person teaching.

Key facts:

- **License:** GNU GPL (open source)
- **Language:** PHP (with JavaScript/CSS for the frontend)
- **Database:** MySQL, MariaDB, PostgreSQL, Microsoft SQL Server, or Oracle
- **Architecture:** Application core + strongly-typed plugin system (~35 plugin types)
- **Official website:** [moodle.org](https://moodle.org)
- **Developer documentation:** [moodledev.io](https://moodledev.io)

---

## Platform Architecture

Moodle follows a classic three-layer architecture (presentation, business logic, data), though the separation is not strongly enforced at the code level. The platform is structured as a **fat core surrounded by plugins**: most feature-specific functionality is delivered through plugins, while the core provides shared libraries for access control, database abstraction, file management, forms, events, and more.

A Moodle installation consists of three components:

- **Web server** (Apache or Nginx) running PHP
- **Database** (MySQL/MariaDB/PostgreSQL/MSSQL/Oracle)
- **File store** (`moodledata` folder) for uploaded and generated files

All three can run on a single server or be distributed across load-balanced infrastructure for high availability.

Each university in this documentation runs its own independent Moodle instance, typically accessible at a subdomain of the institution's main domain:

```
https://elearning.{university}.it/
https://moodle.{university}.it/
https://virtuale.{university}.it/
```

There is no shared infrastructure between institutions - each instance is fully autonomous in terms of configuration, plugins, authentication, and data.

---

## Web Services API

Moodle ships with a built-in **Web Services framework** that exposes platform functionality to external systems. This is the primary integration surface documented in OhMyUniversity! for Moodle-based institutions.

The Web Services API is:

- **Officially documented** and publicly available
- **Enabled per-instance** - each university administrator must explicitly activate the web service protocols and create access tokens
- **Function-based**, not resource-based - calls are made by invoking named functions, not by addressing REST resources

### Supported protocols

The Moodle Web Services framework supports multiple wire protocols:

| Protocol | Endpoint path                   | Notes                                        |
| -------- | ------------------------------- | -------------------------------------------- |
| REST     | `/webservice/rest/server.php`   | Most common; returns XML or JSON             |
| SOAP     | `/webservice/soap/server.php`   | WSDL-based; less commonly used               |
| XML-RPC  | `/webservice/xmlrpc/server.php` | Legacy; not recommended for new integrations |

::: tip
The built-in REST server is not fully RESTful by the Richardson Maturity Model - it uses HTTP as a transport for function calls rather than addressing resources via URL. A third-party plugin (`webservice_restful` by Catalyst) exists for institutions that require a more RESTful interface with discrete URLs per function.
:::

### Request format

All API calls require a **token** passed as a query parameter, alongside the function name and its parameters:

```
GET /webservice/rest/server.php
  ?wstoken={TOKEN}
  &wsfunction={FUNCTION_NAME}
  &moodlewsrestformat=json
  &{additional_parameters}
```

POST requests are also supported, with parameters encoded in the request body.

### Response format

By default, the REST server returns XML. To receive JSON, include `moodlewsrestformat=json` in the request. Regardless of protocol outcome, the HTTP response code is always `200` - errors are reported inside the response body. (The `webservice_restful` plugin changes this behaviour, returning proper 4xx codes on failure.)

### API documentation

Each Moodle instance exposes a self-describing API documentation page for administrators:

```
Site Administration > Server > Web Services > API Documentation
```

This page lists all enabled functions, their parameters, and required capabilities. There is no single global reference for all available functions, as the set depends on which plugins are installed and enabled on each instance.

---

## User Roles

Access to Moodle features is governed by a **role and capability system**. Roles are assigned to users within a specific **context** (system, category, course, activity, or user), and each role is a collection of capabilities. The standard role archetypes shipped with Moodle are:

| Role                  | Archetype        | Context           | Description                                                            |
| --------------------- | ---------------- | ----------------- | ---------------------------------------------------------------------- |
| Site Administrator    | -                | System            | Full unrestricted access; not a role in the traditional sense          |
| Manager               | `manager`        | System / Category | Broad administrative powers; can manage courses without being enrolled |
| Course Creator        | `coursecreator`  | System / Category | Can create new courses                                                 |
| Teacher (Editing)     | `editingteacher` | Course            | Can manage course content, activities, and participants; can grade     |
| Teacher (Non-editing) | `teacher`        | Course            | Can grade and interact with students; cannot modify course structure   |
| Student               | `student`        | Course            | Can access course content and submit work                              |
| Guest                 | `guest`          | Course            | Read-only access; cannot submit or interact                            |

Roles are context-sensitive: a user can be a Teacher in one course and a Student in another simultaneously.

---

## Italian Universities Using Moodle

A separate page lists all **verified Moodle instances** among Italian universities documented in OhMyUniversity!, with direct links to their e-learning portals.

→ See [Italian Universities using Moodle](/api/moodle/universities)

---

## References

- **Moodle official website:** [moodle.org](https://moodle.org)
- **Moodle Developer Resources:** [moodledev.io](https://moodledev.io)
- **Moodle Web Services documentation:** [moodledev.io/docs/apis/subsystems/external](https://moodledev.io/docs/apis/subsystems/external)
- **Using Web Services (admin guide):** [docs.moodle.org/en/Using_web_services](https://docs.moodle.org/en/Using_web_services)
- **Moodle Releases:** [moodledev.io/general/releases](https://moodledev.io/general/releases)
- **Moodle registered sites (Italy):** [stats.moodle.org](https://stats.moodle.org/sites/index.php?country=IT) _(opt-in registry, incomplete)_

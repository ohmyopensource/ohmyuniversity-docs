---
title: RAD - 3.1 Proposed System Overview | OhMyUniversity!
description: Detailed overview of the proposed system architecture of OhMyUniversity!, a multi-platform middleware application designed to aggregate, orchestrate, and simplify access to university digital services.

head:
  - - meta
    - property: og:title
      content: RAD - 3.1 Proposed System Overview | OhMyUniversity!
  - - meta
    - property: og:description
      content: This section presents the proposed system of OhMyUniversity!, including architecture, middleware design, and integration with external university services.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/rad/3-proposed-system/3-1-overview
  - - meta
    - name: keywords
      content: ohmyuniversity, RAD, proposed system, system overview, middleware, multi-platform, architecture, cineca, esse3, moodle, student portal
  - - meta
    - name: twitter:title
      content: RAD - 3.1 Proposed System Overview | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Proposed system architecture of OhMyUniversity!, focusing on middleware integration, multi-platform design, and service aggregation.
---

## OhMyUniversity! - RAD: 3.1 System Overview

The proposed system is a **multi-platform application** (Mobile, Web, and Desktop) designed to integrate informational, operational, and forecasting modules into a unified ecosystem. It acts as a comprehensive **university services aggregator**, providing students with a centralized access point for managing their academic experience.

The architecture is based on a **lean backend layer**, responsible for:

- orchestrating calls to external university web services (such as Cineca/Esse3 and Moodle);
- managing local data storage and caching mechanisms to optimize performance and reliability.

On the client side, the system provides an **intuitive, organized, and user-friendly frontend**, specifically designed to enable rapid and efficient information retrieval, minimizing user effort and navigation complexity.

The system is explicitly designed **not to replace official university management systems**, but rather to **enhance and centralize the user experience**, offering a single, coherent interface that simplifies access to distributed services.sw

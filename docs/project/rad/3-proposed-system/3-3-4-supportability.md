---
title: RAD - 3-3-4 Supportability | OhMyUniversity!
description: Supportability requirements of OhMyUniversity - defining architectural organization, portability, and scalability constraints for a maintainable system.
head:
  - - meta
    - property: og:title
      content: RAD - 3-3-4 Supportability | OhMyUniversity!
  - - meta
    - property: og:description
      content: Supportability requirements of OhMyUniversity - defining architectural organization, portability, and scalability constraints for a maintainable system.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/rad/3-proposed-system/3-3-4-supportability
  - - meta
    - name: keywords
      content: ohmyuniversity, rad, supportability, implementation, nonfunctional requirements, layered architecture, portability, scalability, cloud, aws, cross platform, university app, middleware
  - - meta
    - name: twitter:title
      content: RAD - 3-3-4 Supportability | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Supportability requirements of OhMyUniversity - defining architectural organization, portability, and scalability constraints for a maintainable system.
---

# 3.3.4 Supportability & Implementation

The supportability and implementation requirements define the architectural and technological constraints that must guide the development of **OhMyUniversity!**. These requirements are necessary to ensure that the system remains maintainable, portable across platforms, and scalable according to the number of users and requests.

- **Architecture:** The system must be developed following a layered architecture that clearly separates the Application Layer, Business Logic, and Storage Layer.

- **Portability:** The software must be developed using cross-platform technologies that allow for release on iOS, Android, and Web from a single codebase.

- **Scalability:** The backend must be deployed in a Cloud environment, for example AWS, and configured for automatic horizontal scaling based on the request load.
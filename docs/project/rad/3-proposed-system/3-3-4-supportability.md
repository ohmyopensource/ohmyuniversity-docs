---
title: RAD - 3.3.4 Supportability | OhMyUniversity!
description: Supportability requirements of OhMyUniversity! - defining architectural organization, portability, and scalability constraints for a maintainable system.
head:
  - - meta
    - property: og:title
      content: RAD - 3.3.4 Supportability | OhMyUniversity!
  - - meta
    - property: og:description
      content: Supportability requirements of OhMyUniversity! - defining architectural organization, portability, and scalability constraints for a maintainable system.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/rad/3-proposed-system/3-3-4-supportability
  - - meta
    - name: keywords
      content: ohmyuniversity, rad, supportability, nonfunctional requirements, layered architecture, portability, scalability, cloud, aws, angular, flutter, spring boot, microservices, university app
  - - meta
    - name: twitter:title
      content: RAD - 3.3.4 Supportability | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Supportability requirements of OhMyUniversity! - defining architectural organization, portability, and scalability constraints for a maintainable system.
---

# OhMyUniversity! - RAD: 3.3.4 Supportability

The supportability requirements define the structural and operational constraints that must guide the long-term maintenance and evolution of **OhMyUniversity!**. These requirements ensure the system remains comprehensible, adaptable, and operable over time, even as the team grows or the technology landscape changes.

## Architecture

The system must follow a layered architecture that provides a clear and enforceable separation of concerns across three tiers:

- **Presentation Layer:** Responsible for user interface rendering and interaction logic. Implemented via **Angular** for the web client and **Flutter** for the mobile client (iOS and Android). This layer communicates with the Business Logic Layer exclusively through REST APIs, exchanging data via well-defined Data Transfer Objects (DTOs). It must not contain any domain or persistence logic.
- **Business Logic Layer:** Contains all domain-specific rules, workflows, and orchestration logic, implemented as a set of **Spring Boot** microservices. Each microservice owns its bounded domain and exposes REST endpoints consumed by the Presentation Layer. Inter-service communication is also governed by REST interfaces and DTOs, ensuring a clear and versioned contract at every boundary.
- **Storage Layer:** Handles data persistence, including relational databases, caches, and file storage. This layer is accessed exclusively through the Business Logic Layer and must not expose its internals to the Presentation Layer.

This separation ensures that each layer can be tested, modified, or replaced independently, reducing the risk of regressions and making onboarding of new developers significantly easier.

## Portability

The system must run consistently across different environments and client platforms:

- The **Presentation Layer** targets three platforms - Web (Angular), iOS (Flutter), and Android (Flutter) - from two distinct, well-maintained codebases. Each client must deliver a comparable user experience, with platform-specific adaptations isolated and clearly documented.
- The **Business Logic Layer** microservices must be containerized using **Docker**, ensuring that each service runs identically across local development, CI environments, and production, regardless of the underlying host infrastructure.
- Deployment configurations must be expressed as code (e.g., Docker Compose for local environments, AWS infrastructure definitions for production), making the system reproducible and auditable at every stage.

## Scalability

The Business Logic Layer must be deployed on AWS and designed to scale horizontally in response to varying request loads. The microservices architecture naturally supports independent scaling of individual services, allowing the system to allocate resources where demand is highest - for example during exam periods or enrollment deadlines - without over-provisioning unaffected components.

Key scalability expectations include:

- **Stateless microservices:** Each Spring Boot service must be stateless to allow transparent load balancing and seamless horizontal scaling.
- **Autoscaling policies:** Resource scaling must be driven by observable metrics - such as CPU usage and request latency, collected via **Prometheus** - and configured to scale both up and down automatically. The underlying mechanism is provided by AWS autoscaling groups, with a planned migration path to **Kubernetes** Horizontal Pod Autoscalers as the infrastructure matures.
- **Decoupled components:** Long-running or resource-intensive operations must be offloaded to asynchronous workers or message queues to avoid blocking the main request path and degrading responsiveness.
- **Monitoring and observability:** System health must be continuously tracked using **Prometheus** for metrics collection and **Grafana** for visualization and alerting, enabling the team to detect and respond to degradation before it impacts users.

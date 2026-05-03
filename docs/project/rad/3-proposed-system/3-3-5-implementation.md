---
title: RAD - 3.3.5 Implementation | OhMyUniversity!
description: Implementation requirements of OhMyUniversity! - specifying the programming languages, frameworks, tools, and conventions that govern the development process.
head:
  - - meta
    - property: og:title
      content: RAD - 3.3.5 Implementation | OhMyUniversity!
  - - meta
    - property: og:description
      content: Implementation requirements of OhMyUniversity! - specifying the programming languages, frameworks, tools, and conventions that govern the development process.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/rad/3-proposed-system/3-3-5-implementation
  - - meta
    - name: keywords
      content: ohmyuniversity, rad, implementation, nonfunctional requirements, angular, flutter, spring boot, microservices, dto, docker, github, prometheus, grafana, google style guide, university app
  - - meta
    - name: twitter:title
      content: RAD - 3.3.5 Implementation | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Implementation requirements of OhMyUniversity! - specifying the programming languages, frameworks, tools, and conventions that govern the development process.
---

# OhMyUniversity! - RAD: 3.3.5 Implementation

The implementation requirements specify the technical standards, tools, and conventions that must be adopted throughout the development of **OhMyUniversity!**. These constraints aim to ensure consistency across the codebase, facilitate collaboration among team members, and establish a shared technological foundation for all layers of the system.

## Technologies per Layer

### Presentation Layer

The Presentation Layer is implemented using two distinct technologies depending on the target platform:

- **Angular** is used for the web client. It provides a component-based architecture, strong typing via TypeScript, and a well-structured module system that aligns with the separation of concerns enforced by the overall layered architecture.
- **Flutter** is used for the mobile client, targeting both iOS and Android from a single Dart codebase. Flutter's widget model enables native-quality UI rendering on both platforms without duplicating presentation logic.

Both clients communicate with the Business Logic Layer exclusively via REST APIs. Data exchanged across this boundary must conform to the DTOs defined and versioned by the Business Logic Layer - neither client may bypass this contract or access the Storage Layer directly.

### Business Logic Layer

The Business Logic Layer is implemented as a set of **Spring Boot** microservices, each responsible for a specific bounded domain (e.g., authentication, course management, scheduling). Key implementation constraints include:

- **REST API design:** Each microservice exposes REST endpoints as its external interface. API design must follow consistent conventions across all services (resource naming, HTTP method semantics, status codes).
- **DTO-based communication:** All data exchanged between the Presentation Layer and the Business Logic Layer, as well as between microservices, must be mediated by Data Transfer Objects. DTOs decouple the internal domain model from the external API contract, preventing leakage of persistence details and enabling independent evolution of each service.
- **Domain isolation:** Each microservice owns its data and must not directly access another service's database. Cross-service data needs must be satisfied through inter-service API calls.

### Storage Layer

The Storage Layer is not exposed directly to any external layer. Each microservice is responsible for managing its own persistence mechanism, which may include relational databases, document stores, or caches depending on the domain requirements. The choice of storage technology per service must be documented and justified.

## Development Tools and Environment

### Version Control

The project must use **Git**, hosted on **GitHub**, as the single source of truth for all source code, configuration, and infrastructure definitions. The following practices are mandatory:

- The `main` branch must be protected: direct pushes are not permitted and all changes must go through a reviewed Pull Request.
- Branch naming must follow a consistent convention (e.g., `feature/`, `fix/`, `chore/` prefixes).
- Commit messages must be clear and descriptive, following the Conventional Commits specification where applicable.

### Containerization

All microservices and supporting infrastructure components must be containerized using **Docker**. Each service must ship with a `Dockerfile` that produces a minimal, reproducible image. Local multi-service orchestration must be managed via **Docker Compose**.

For production, services are deployed on **AWS**. A migration to **Kubernetes** is considered for a future phase of the project, once operational complexity justifies the overhead. Deployment configurations must be version-controlled alongside the application code.

### Monitoring

System observability is provided by **Prometheus** and **Grafana**:

- **Prometheus** is responsible for scraping and storing metrics exposed by each Spring Boot microservice (via the `/actuator/prometheus` endpoint) and by the infrastructure.
- **Grafana** provides dashboards for real-time visualization of system health and performance, and must be configured with alerting rules for critical thresholds (e.g., error rate spikes, latency degradation, memory pressure).

Each microservice must expose standard application metrics (request count, error rate, response time) and may expose domain-specific metrics where relevant.

## Coding Standards and Conventions

All code produced for **OhMyUniversity!** must adhere to the relevant **Google Style Guides**:

- **Java:** [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html) - applied to all Spring Boot microservices.
- **TypeScript/Angular:** [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) - applied to the Angular web client.
- **Dart/Flutter:** [Effective Dart](https://dart.dev/effective-dart) - applied to the Flutter mobile client, which is endorsed by the Dart team and consistent with Google's style philosophy.

Compliance with these conventions must be enforced automatically through linters and formatters configured in each project. Linting checks must be integrated into the CI pipeline and act as a merge gate: a Pull Request that fails style checks must not be merged.

## Testing Requirements

The system must maintain meaningful test coverage at multiple levels to ensure correctness and enable confident refactoring.

- **Unit tests:** All business logic within Spring Boot microservices must be covered by unit tests that run in isolation, with external dependencies mocked. Presentation Layer components must also be covered by unit tests for logic-bearing classes and widgets.
- **Integration tests:** REST endpoints must be covered by integration tests that exercise the full request-handling stack, including serialization, validation, and DTO mapping, against an in-memory or containerized database.
- **End-to-end tests:** Critical user flows must be validated by automated end-to-end tests executed against a staging environment before each release.

## Continuous Integration and Delivery

The project must adopt a CI/CD pipeline hosted on **GitHub Actions** (or an equivalent platform integrated with the GitHub repository). The pipeline must enforce the following:

- **On every Pull Request:** run linting, unit tests, and integration tests. Merge is blocked if any step fails.
- **On merge to `main`:** build Docker images for all affected microservices, run the full test suite, and deploy automatically to the staging environment.
- **Production deployments:** must require explicit manual approval and must be preceded by a successful validation on staging.

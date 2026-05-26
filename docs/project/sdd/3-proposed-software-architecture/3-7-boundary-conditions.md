---
title: SDD - 3.7 Boundary Conditions | OhMyUniversity!
description: Definition of the boundary conditions for the OhMyUniversity! system, including persistent object configuration, component lifecycle (start-up, shutdown), and exceptional use cases, formalized via standard Use Case templates.
head:
  - - meta
    - property: og:title
      content: SDD - 3.7 Boundary Conditions | OhMyUniversity!
  - - meta
    - property: og:description
      content: Definition of the boundary conditions for the OhMyUniversity! system, including persistent object configuration, component lifecycle, and exceptional use cases.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/sdd/3-proposed-software-architecture/3-7-boundary-conditions
  - - meta
    - name: keywords
      content: ohmyuniversity, sdd, boundary conditions, startup, shutdown, exceptions, exceptional use cases, configuration, lifecycle, persistence, ACID, fallback
  - - meta
    - name: twitter:title
      content: SDD - 3.7 Boundary Conditions | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Definition of the boundary conditions for the OhMyUniversity! system, including persistent object configuration, component lifecycle (start-up, shutdown), and exceptional use cases.
---

# OhMyUniversity! - SDD: 3.7 Boundary Conditions

## Overview

Boundary Conditions define the system's behavior in **non-ordinary states**—during initialization, termination, and error scenarios. These conditions are often overlooked in design but are critical for system robustness and reliability.

Following System Design best practices, boundary conditions have been systematically identified by examining:

1. Each **persistent object** and its lifecycle
2. Each **microservice component** and its operational states
3. Each **failure mode** from external systems and infrastructure

These conditions are formalized through dedicated **Use Cases** invoked by system administrators, orchestrators, and failure recovery mechanisms.

## Boundary Condition Actors

| Type      | Actor                        | Description                                                                                         |
| --------- | ---------------------------- | --------------------------------------------------------------------------------------------------- |
| Secondary | System Administrator         | Authorized personnel managing system configuration, credentials, and operational policies.          |
| Secondary | Infrastructure & Operations  | Responsible for deploying, scaling, and monitoring the system's health and recovery.                |
| Secondary | PostgreSQL Database Engine   | Persistent data store; secondary actor in configuration and recovery scenarios.                     |
| Secondary | Redis Cache Layer            | In-memory cache for session data and academic records; subject to connectivity failures.            |
| Secondary | API Gateway                  | Central routing component; coordinates request flow during maintenance and component shutdown.      |
| Secondary | External Integration Gateway | Proxy component intercepting calls to external systems (Cineca, Moodle, Canteen); detects failures. |

---

## Configuration of Persistent Objects

Persistent objects represent long-lived data that survives beyond a single application execution. Objects not created or destroyed through normal operational use cases require explicit **Configuration Use Cases** managed by the System Administrator.

The following persistent entities require configuration:

- **PartnerOrg**: Partner organizations participating in agreements and discounts.
- **SystemParameter**: Global system settings (cache TTL, rate limits, timeout thresholds).
- **AcademicYear**: Active academic years and their calendars.
- **IntegrationCredential**: API keys and tokens for external services (Cineca, Moodle, Canteen).

<br>

### UC-Admin-01: Manage Partner Organizations

| Section              | Content                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Actors**           | **Primary Actor:** System Administrator                                                                                       |
| **Assumptions**      | The PostgreSQL database is online and accessible. • The administrator possesses root-level authentication credentials.        |
| **Entry Conditions** | The administrator is authenticated in the control panel with root privileges. • The "Partner Management" interface is loaded. |

| **Event Flow** | **Administrator**                                                                                                               | **System**                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1.             | The administrator navigates to **"Manage Partner Organizations"**.                                                              |                                                                                                  |
| 2.             |                                                                                                                                 | The system retrieves the list of existing partner organizations from PostgreSQL.                 |
| 3.             | The administrator creates a new partner organization by entering: name, discount percentage, logo URL, and contact information. |                                                                                                  |
| 4.             |                                                                                                                                 | The system validates all input fields and checks for duplicate entries.                          |
| 5.             |                                                                                                                                 | The system persists the new `PartnerOrg` object to the database and assigns a unique identifier. |
| 6.             |                                                                                                                                 | The system updates the cache to refresh the organization list.                                   |
| 7.             |                                                                                                                                 | The system logs the administrative action for audit purposes.                                    |
| 8.             | The administrator receives a confirmation message.                                                                              |                                                                                                  |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exceptions**      | **Invalid input data:** The system rejects non-compliant entries and returns an error message. • **Database constraint violation:** If a unique constraint fails (duplicate name or email), the system notifies the administrator and suggests a resolution. • **Database unreachable:** If PostgreSQL is offline, the system displays a connection error and prevents the configuration operation. |
| **Exit Conditions** | The `PartnerOrg` persistent object is successfully created in PostgreSQL. • The object is immediately visible to students browsing the agreements section. • The administrative action is logged for audit trail compliance.                                                                                                                                                                        |

<br>

### UC-Admin-02: Manage System Parameters

| Section              | Content                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Actors**           | **Primary Actor:** System Administrator                                                                                   |
| **Assumptions**      | The PostgreSQL configuration table exists and is properly initialized. • The administrator has administrative privileges. |
| **Entry Conditions** | The administrator is authenticated with root privileges. • The "System Configuration" panel is accessible.                |

| **Event Flow** | **Administrator**                                                                        | **System**                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1.             | The administrator navigates to **"System Parameters"**.                                  |                                                                                                                                    |
| 2.             |                                                                                          | The system retrieves all current system parameters from PostgreSQL (e.g., cache TTL, API timeout thresholds, request rate limits). |
| 3.             |                                                                                          | The system displays each parameter with its current value, type, and description.                                                  |
| 4.             | The administrator modifies one or more parameters according to operational requirements. |                                                                                                                                    |
| 5.             |                                                                                          | The system validates the new values against type constraints and acceptable ranges.                                                |
| 6.             |                                                                                          | The system persists changes to PostgreSQL.                                                                                         |
| 7.             |                                                                                          | The system broadcasts a configuration update event to all running microservices.                                                   |
| 8.             |                                                                                          | The system logs the configuration change with the administrator ID and timestamp.                                                  |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exceptions**      | **Invalid parameter value:** If the new value falls outside acceptable ranges or violates type constraints, the system rejects the change and explains the constraint. • **Microservice update failure:** If one or more microservices fail to receive or apply the configuration update, the system logs a warning; the administrator is notified to verify the affected services' health. • **Database transaction failure:** If the update cannot be committed, the system rolls back and asks the administrator to retry. |
| **Exit Conditions** | System parameters are updated in PostgreSQL. • All active microservices receive and apply the new configuration within their next operational cycle. • Changes are retroactively logged for compliance and troubleshooting.                                                                                                                                                                                                                                                                                                   |

<br>

### UC-Admin-03: Manage Academic Years and Calendars

| Section              | Content                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actors**           | **Primary Actor:** System Administrator • **Secondary Actor:** PostgreSQL Database                                                                 |
| **Assumptions**      | The academic calendar structure is predefined in the database schema. • The administrator has access to the official university academic calendar. |
| **Entry Conditions** | The administrator is authenticated with root privileges. • The "Academic Calendar Management" interface is available.                              |

| **Event Flow** | **Administrator**                                                                                                                 | **System**                                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1.             | The administrator navigates to **"Manage Academic Years"**.                                                                       |                                                                                                                                       |
| 2.             |                                                                                                                                   | The system displays a list of existing academic years and their statuses.                                                             |
| 3.             | The administrator selects an academic year and defines key dates: semester boundaries, exam session windows, and holiday periods. |                                                                                                                                       |
| 4.             |                                                                                                                                   | The system validates that date ranges do not overlap and that all mandatory periods are defined.                                      |
| 5.             |                                                                                                                                   | The system persists the academic calendar to PostgreSQL and marks it as active.                                                       |
| 6.             |                                                                                                                                   | The system updates the cache with the new calendar.                                                                                   |
| 7.             |                                                                                                                                   | The system broadcasts an event so that dependent components (exam bookings, classroom scheduling) refresh their available time slots. |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exceptions**      | **Overlapping date ranges:** The system detects and rejects configurations where periods overlap. The administrator is prompted to review and adjust the dates. • **Missing mandatory periods:** If critical dates are not defined, the system prevents activation. • **Active year conflict:** If attempting to switch from one active year to another while transactions are in progress, the system prevents the switch or queues the transition. |
| **Exit Conditions** | A new academic calendar is active in the system. • All students and staff see updated academic periods. • Historical versions of previous years remain archived for reporting and compliance.                                                                                                                                                                                                                                                        |

<br>

### UC-Admin-04: Manage Integration Credentials

| Section              | Content                                                                                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actors**           | **Primary Actor:** System Administrator • **Secondary Actor:** PostgreSQL Database, External Integration Gateway                                                                                                      |
| **Assumptions**      | Integration credentials are securely stored and encrypted. • The External Integration Gateway is running and accessible. • Credentials are provided by the external service administrators (Cineca, Moodle, Canteen). |
| **Entry Conditions** | The administrator is authenticated with root privileges. • The "Integration Credentials" management panel is loaded.                                                                                                  |

| **Event Flow** | **Administrator**                                                                                                          | **System**                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1.             | The administrator navigates to **"Manage Integration Credentials"**.                                                       |                                                                                                                                         |
| 2.             |                                                                                                                            | The system retrieves the list of configured integrations with their status and last validation timestamp.                               |
| 3.             | The administrator selects an integration and enters or updates the credential (API key, token, or authentication details). |                                                                                                                                         |
| 4.             |                                                                                                                            | The system encrypts the credential and persists it to the database.                                                                     |
| 5.             |                                                                                                                            | The system validates the credential by attempting a lightweight test call to the external service.                                      |
| 6.             |                                                                                                                            | The system marks the credential status as "Valid" if validation succeeds. If validation fails, the administrator is prompted to review. |
| 7.             |                                                                                                                            | The system updates the External Integration Gateway to use the new credentials.                                                         |
| 8.             |                                                                                                                            | The system logs the credential update event for security auditing.                                                                      |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Exceptions**      | **Invalid credential format:** The system rejects malformed credentials before encryption. • **External service unreachable:** The system allows the credential to be saved but marks it with a warning status, pending revalidation. • **Credential validation fails:** The administrator is prompted to review the credential and external service status. |
| **Exit Conditions** | Integration credentials are securely stored and validated. • The External Integration Gateway uses the updated credentials for all subsequent calls to external systems.                                                                                                                                                                                     |

---

## Component Lifecycle: Start-up, Shutdown, and Configuration

Each microservice and supporting component goes through a well-defined lifecycle. Proper lifecycle management ensures data consistency, graceful degradation, and minimal downtime.

<br>

### UC-Sys-01: Component Start-up (Microservice Initialization)

| Section              | Content                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Actors**           | **Primary Actor:** Infrastructure & Operations • **Secondary Actors:** PostgreSQL Database Engine, Redis Cache Layer, API Gateway    |
| **Assumptions**      | The microservice deployment package is available. • Required configuration is accessible.                                            |
| **Entry Conditions** | A microservice is being deployed or restarted by Infrastructure & Operations (e.g., due to scaling, deployment update, or recovery). |

| **Event Flow** | **Infrastructure & Operations**         | **System (Microservice)**                                                                               |
| -------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1.             | A new microservice instance is started. |                                                                                                         |
| 2.             |                                         | The microservice loads configuration (database connection details, cache settings, service parameters). |
| 3.             |                                         | The microservice attempts to establish connections to PostgreSQL and Redis.                             |
| 4.             |                                         | The microservice performs internal consistency checks and validation.                                   |
| 5.             |                                         | The microservice transitions to "Ready" state.                                                          |
| 6.             |                                         | The API Gateway discovers the healthy microservice and begins routing requests to it.                   |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exceptions**      | **PostgreSQL unreachable:** The microservice retries connection attempts. If connections fail after a configured retry window, the microservice is marked unhealthy and may be restarted by Infrastructure & Operations. • **Redis unavailable (non-critical):** If Redis is unavailable but PostgreSQL is accessible, the microservice starts in a degraded mode without caching. Performance degrades but the system remains functional. • **Configuration validation fails:** If required configuration is missing or invalid, the microservice fails to start and logs the error for investigation. |
| **Exit Conditions** | The microservice is fully operational and ready to accept requests. • Critical connections (PostgreSQL, Redis) are established. • The microservice is registered in the routing layer.                                                                                                                                                                                                                                                                                                                                                                                                                  |

<br>

### UC-Sys-02: Component Termination (Graceful Shutdown)

| Section              | Content                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actors**           | **Primary Actor:** Infrastructure & Operations • **Secondary Actors:** API Gateway, PostgreSQL Database                                           |
| **Assumptions**      | The microservice is currently healthy and processing requests. • Termination may be triggered by deployment update, scaling down, or maintenance. |
| **Entry Conditions** | Infrastructure & Operations initiates a controlled shutdown of a microservice component.                                                          |

| **Event Flow** | **Infrastructure & Operations**                   | **System (Microservice)**                                                                                                                                            |
| -------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.             | A shutdown command is issued to the microservice. |                                                                                                                                                                      |
| 2.             |                                                   | The microservice enters **Shutdown Mode**.                                                                                                                           |
| 3.             |                                                   | The microservice notifies the API Gateway to stop routing new requests.                                                                                              |
| 4.             |                                                   | The microservice allows active request-handling threads a grace period to complete in-flight operations (e.g., finish HTTP responses, commit database transactions). |
| 5.             |                                                   | The microservice does not accept new requests during this grace period.                                                                                              |
| 6.             |                                                   | Active threads complete their operations normally, rolling back or committing transactions as needed.                                                                |
| 7.             |                                                   | The microservice releases database connections and closes cache connections gracefully.                                                                              |
| 8.             |                                                   | The microservice logs the shutdown event and exits cleanly.                                                                                                          |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exceptions**      | **Thread does not complete within grace period:** If a thread is still executing after the grace period (e.g., long-running computation or network call to an unresponsive external service), Infrastructure & Operations may force termination. PostgreSQL's ACID properties ensure that any incomplete transaction is rolled back without data corruption. • **Database connection pool drain timeout:** If closing database connections takes longer than expected, the system logs a warning and proceeds with forceful closure if necessary. |
| **Exit Conditions** | The microservice is cleanly shut down with no loss of persistent data. • In-flight transactions are properly committed or rolled back. • All connections are closed. • The microservice is removed from the routing table.                                                                                                                                                                                                                                                                                                                        |

<br>

### UC-Sys-03: Component Configuration Reloading

| Section              | Content                                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Actors**           | **Primary Actor:** System Administrator • **Secondary Actors:** Microservices                                                            |
| **Assumptions**      | One or more microservices are currently running. • Configuration changes have been persisted to PostgreSQL (via UC-Admin-02).            |
| **Entry Conditions** | The administrator has updated system parameters via UC-Admin-02. • Microservices need to apply the new configuration without restarting. |

| **Event Flow** | **Administrator**                                                      | **System**                                                                        |
| -------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1.             | The administrator triggers a "Broadcast Configuration Update" command. |                                                                                   |
| 2.             |                                                                        | The system retrieves all updated parameters from PostgreSQL.                      |
| 3.             |                                                                        | For each running microservice, the system publishes a configuration update event. |
| 4.             |                                                                        | Each microservice receives the update and validates the new parameter values.     |
| 5.             |                                                                        | If validation succeeds, the microservice applies the configuration change.        |
| 6.             |                                                                        | Each microservice logs the change and confirms the update.                        |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Exceptions**      | **Microservice does not respond to update:** The system logs a warning and continues broadcasting to other microservices. The administrator is notified of unresponsive services. • **Invalid configuration values:** If a microservice detects invalid values, it rejects the update and retains the previous configuration. The administrator is alerted to fix the values. • **Partial update failure:** If some microservices successfully update but others fail, the administrator is prompted to retry or verify affected services. |
| **Exit Conditions** | System parameters are updated across all running microservices. • New requests are handled according to the updated configuration.                                                                                                                                                                                                                                                                                                                                                                                                         |

---

## Exception and Failure Handling (Exceptional Use Cases)

Exceptional use cases formalize the system's response to unexpected conditions, including external service failures, network disruptions, and race conditions. These are modeled as **extensions** (`<<extend>>`) to the base use cases, defining precise recovery strategies.

### UC-Exc-01: Working Offline Fallback (`<<extend>>` UC-02, UC-03, UC-04)

| Section              | Content                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actors**           | **Primary Actor:** Student • **Secondary Actors:** External Integration Gateway, Redis Cache Layer, PostgreSQL Database                                                                                 |
| **Assumptions**      | The student has successfully accessed the system at least once before, so cached academic data exists in Redis. • The External Integration Gateway is running and monitoring calls to external systems. |
| **Entry Conditions** | The student initiates an operation that requires external data (e.g., UC-02 View Academic Career). • A call to an external system (Cineca, Moodle, Canteen) times out or returns an HTTP error (5xx).   |

| **Event Flow** | **Student**                                      | **System**                                                                                                                              |
| -------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1.             | The student requests their Academic Career view. |                                                                                                                                         |
| 2.             |                                                  | The system queries the External Integration Gateway to fetch the latest academic records from Cineca.                                   |
| 3.             |                                                  | The external service does not respond within the configured timeout or returns an error.                                                |
| 4.             |                                                  | The External Integration Gateway intercepts the failure and activates a **Fallback Mechanism**.                                         |
| 5.             |                                                  | The system queries Redis Cache for the student's last-known academic data.                                                              |
| 6.             |                                                  | If cached data exists, the system retrieves it.                                                                                         |
| 7.             |                                                  | The system displays the academic career using cached data and shows a banner indicating offline mode and data age.                      |
| 8.             |                                                  | The system disables write operations and displays an informational message.                                                             |
| 9.             |                                                  | The system periodically attempts to reconnect to the external service; when recovered, the banner is removed and live data is reloaded. |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exceptions**      | **Cache miss:** If the student has never previously accessed the system or cached data has expired, the system displays an error message indicating the external service is temporarily unavailable. • **Cache and external service unavailable:** A critical error page is displayed with support instructions. • **Cache corruption:** If cached data is corrupted, the system logs the error and displays an offline error message. |
| **Exit Conditions** | The student can view their academic career in offline mode with a clear indication of data staleness. • Write operations are prevented to ensure no inconsistent state is introduced. • When external connectivity is restored, the system seamlessly transitions to live data without requiring a refresh or logout.                                                                                                                  |

<br>

### UC-Exc-02: Handle Overbooking Conflict (`<<extend>>` UC-09 Manage Classroom Booking)

| Section              | Content                                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actors**           | **Primary Actor:** Student • **Secondary Actors:** PostgreSQL Database                                                                                                       |
| **Assumptions**      | The classroom has a strict maximum capacity. • PostgreSQL enforces capacity constraints at the database level. • Two or more students attempt to book simultaneously.        |
| **Entry Conditions** | A student confirms a reservation for a resource with limited availability (e.g., classroom seating). • Another student simultaneously attempts to reserve the same resource. |

| **Event Flow** | **Student 1**                                   | **Student 2**                                                                                                    | **System**                                                                                    |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1.             | Views available resources.                      | Views available resources.                                                                                       |                                                                                               |
| 2.             | Sees 1 resource available and confirms booking. | Sees 1 resource available (stale view) and confirms booking.                                                     |                                                                                               |
| 3.             |                                                 |                                                                                                                  | Begins database transaction for Student 1's booking.                                          |
| 4.             |                                                 |                                                                                                                  | Acquires lock on the resource and updates capacity.                                           |
| 5.             |                                                 |                                                                                                                  | Commits Student 1's transaction. Resource is reserved.                                        |
| 6.             |                                                 |                                                                                                                  | Begins database transaction for Student 2's booking.                                          |
| 7.             |                                                 |                                                                                                                  | Attempts to lock the resource. A conflict is detected (capacity constraint or lock conflict). |
| 8.             |                                                 |                                                                                                                  | Rolls back Student 2's transaction.                                                           |
| 9.             |                                                 | **Receives notification:** "The resource you selected is no longer available. Please select a different option." |                                                                                               |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exceptions**      | **Deadlock during concurrent operations:** If transactions lock resources in conflicting orders, the database detects a deadlock and aborts one transaction. The affected student receives an error and must retry. • **Constraint violation:** If the database constraint fails (e.g., capacity exceeded), the transaction is rolled back with an appropriate error message. |
| **Exit Conditions** | Only one student successfully reserves the last seat; the other receives an immediate, user-friendly notification. • The database remains in a consistent state (ACID properties maintained). • The system does not crash or enter a deadlock loop. • The second student is guided to alternative booking options.                                                            |

<br>

### UC-Exc-03: Handle External Service Timeout

(`<<extend>>` UC-02 View Academic Career, UC-04 Manage Exam Sessions)

| Section              | Content                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actors**           | **Primary Actor:** Student • **Secondary Actors:** External Integration Gateway                                                                   |
| **Assumptions**      | External systems (Cineca, Moodle) have configured timeout thresholds. • The External Integration Gateway monitors and handles timeout exceptions. |
| **Entry Conditions** | The student initiates an operation requiring external data. • The external system is responding slowly or is unreachable.                         |

| **Event Flow** | **Student**                                 | **System**                                                                                                   |
| -------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1.             | The student requests their academic career. |                                                                                                              |
| 2.             |                                             | The External Integration Gateway initiates a call to the external system (Cineca) with a configured timeout. |
| 3.             |                                             | The external system does not respond within the timeout window.                                              |
| 4.             |                                             | The External Integration Gateway intercepts the timeout exception.                                           |
| 5.             |                                             | The system activates UC-Exc-01 (Working Offline Fallback): retrieves cached data.                            |
| 6.             |                                             | The system logs the timeout event for monitoring and alerting.                                               |

| Section             | Content                                                                                                                                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Exceptions**      | **Multiple external service failures:** If several external systems time out simultaneously, the fallback mechanism ensures cached data is still available. • **Cache unavailable:** If cached data is not available (UC-Exc-01 exception), the student receives an offline error message. |
| **Exit Conditions** | The student sees cached data with an offline status indicator. • The system avoids overwhelming the struggling external service with excessive retry attempts. • Operations team is alerted to investigate external service health.                                                        |

<br>

### UC-Exc-04: Handle Database Connection Loss

(`<<extend>>` UC-02 View Academic Career, UC-09 Manage Classroom Booking)

| Section              | Content                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actors**           | **Primary Actor:** Microservice Component • **Secondary Actors:** PostgreSQL Database Engine                                                                       |
| **Assumptions**      | A microservice is running normally with active database connections. • A network partition, database maintenance, or database failure suddenly severs connections. |
| **Entry Conditions** | A microservice attempts to execute a database query. • The database connection is no longer valid.                                                                 |

| **Event Flow** | **Microservice**                    | **System**                                                                                      |
| -------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1.             | A request requires database access. |                                                                                                 |
| 2.             |                                     | The system attempts to use an existing database connection.                                     |
| 3.             |                                     | The connection is invalid or stale (network issue or database down).                            |
| 4.             |                                     | The system logs the connection error.                                                           |
| 5.             |                                     | The system attempts to establish a new connection to PostgreSQL.                                |
| 6.             |                                     | **If PostgreSQL is down:** The connection attempt fails. The system retries with backoff logic. |
| 7.             |                                     | After repeated failures, the microservice transitions to an unhealthy state.                    |
| 8.             |                                     | The API Gateway removes the unhealthy microservice from the routing pool.                       |
| 9.             |                                     | Requests are routed to healthy replicas (if available) or return an error to the user.          |

| Section             | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exceptions**      | **Database remains down:** The microservice eventually becomes unavailable. Infrastructure & Operations is alerted to investigate and recover the database. • **Connection pool exhaustion:** If connection errors occur faster than new connections can be created, the microservice becomes unavailable until PostgreSQL recovers. • **Failed transaction during outage:** Any in-flight transaction is rolled back by PostgreSQL, ensuring no data corruption due to ACID properties. |
| **Exit Conditions** | If PostgreSQL recovers, the microservice reconnects and resumes normal operation. • If unavailable, users receive an error message indicating a backend service is temporarily unavailable. • The operations team is notified to investigate database health and recovery.                                                                                                                                                                                                               |

---

## Traceability to Base Use Cases

The following boundary condition use cases extend or support base functional use cases:

| Boundary Condition Use Case                  | Extends / Relates To      | Trigger                                               |
| -------------------------------------------- | ------------------------- | ----------------------------------------------------- |
| UC-Admin-01: Manage Partner Organizations    | N/A (Configuration)       | Administrator action during setup or maintenance      |
| UC-Admin-02: Manage System Parameters        | N/A (Configuration)       | Administrator action to tune operational parameters   |
| UC-Admin-03: Manage Academic Years           | N/A (Configuration)       | Occurs at the start of each academic year or semester |
| UC-Admin-04: Manage Integration Credentials  | N/A (Configuration)       | When credentials expire or services are onboarded     |
| UC-Sys-01: Component Start-up                | N/A (Lifecycle)           | Deployment, scaling, or recovery from failure         |
| UC-Sys-02: Component Termination             | N/A (Lifecycle)           | Maintenance, scaling down, or controlled shutdown     |
| UC-Sys-03: Component Configuration Reloading | N/A (Lifecycle)           | Administrator triggers configuration update           |
| UC-Exc-01: Working Offline Fallback          | `<<extend>>` UC-02, UC-04 | External service timeout or failure                   |
| UC-Exc-02: Handle Overbooking Conflict       | `<<extend>>` UC-09        | Concurrent booking attempts on limited resources      |
| UC-Exc-03: Handle External Service Timeout   | `<<extend>>` UC-02, UC-04 | Slow or unresponsive external system                  |
| UC-Exc-04: Handle Database Connection Loss   | `<<extend>>` UC-02, UC-09 | Network partition or database failure                 |

---

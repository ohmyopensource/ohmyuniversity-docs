---
title: RAD - 3.3.2 Reliability | OhMyUniversity!
description: Reliability requirements of OhMyUniversity - defining fault tolerance, data integrity, and availability constraints for a stable and dependable system.
head:
  - - meta
    - property: og:title
      content: RAD - 3.3.2 Reliability | OhMyUniversity!
  - - meta
    - property: og:description
      content: Reliability requirements of OhMyUniversity - defining fault tolerance, data integrity, and availability constraints for a stable and dependable system.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/rad/3-proposed-system/3-3-2-reliability
  - - meta
    - name: keywords
      content: ohmyuniversity, rad, reliability, nonfunctional requirements, fault tolerance, data integrity, availability, uptime, cache, cineca, moodle, university app, middleware
  - - meta
    - name: twitter:title
      content: RAD - 3.3.2 Reliability | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Reliability requirements of OhMyUniversity - defining fault tolerance, data integrity, and availability constraints for a stable and dependable system.
---

# OhMyUniversity! - RAD: 3.3.2 Reliability

The reliability requirements define how **OhMyUniversity!** must behave to guarantee continuity of service, correctness of information, and operational stability. Since the system depends on external university services, it must be able to manage temporary failures while preserving data accuracy and user trust.

- **Fault Tolerance:** In case of unavailability of external APIs, such as Cineca or Moodle, the system must load the last cached version of the data within 500ms, clearly signaling the "working offline" status to the user.

- **Data Integrity:** Calculations related to the arithmetic mean, weighted mean, and graduation base must show 100% correspondence with the official Cineca data, with zero error tolerance.

- **Availability:** The system backend must guarantee an uptime of 99.9% on a monthly basis.

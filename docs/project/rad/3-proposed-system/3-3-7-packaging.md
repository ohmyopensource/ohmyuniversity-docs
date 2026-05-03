---
title: RAD - 3.3.7 Packaging | OhMyUniversity!
description: Packaging requirements of OhMyUniversity! - defining software distribution channels and release constraints for each target platform.
head:
  - - meta
    - property: og:title
      content: RAD - 3.3.7 Packaging | OhMyUniversity!
  - - meta
    - property: og:description
      content: Packaging requirements of OhMyUniversity! - defining software distribution channels and release constraints for each target platform.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/rad/3-proposed-system/3-3-7-packaging
  - - meta
    - name: keywords
      content: ohmyuniversity, rad, packaging, nonfunctional requirements, distribution, app store, google play, web app, flutter, angular, release, university app
  - - meta
    - name: twitter:title
      content: RAD - 3.3.7 Packaging | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Packaging requirements of OhMyUniversity! - defining software distribution channels and release constraints for each target platform.
---

# OhMyUniversity! - RAD: 3.3.7 Packaging

The packaging requirements define how **OhMyUniversity!** must be built, assembled, and distributed to end users across its target platforms. Since the system is delivered through multiple clients developed on different technology stacks, each platform has its own distribution channel and release constraints.

## Distribution Channels

The system must be released through the following official channels:

- **Apple App Store:** The Flutter-based iOS client must be distributed through Apple's App Store. The release package must comply with Apple's app review guidelines, including binary signing requirements, privacy manifest declarations, and age rating classification.
- **Google Play Store:** The Flutter-based Android client must be distributed through the Google Play Store. The release package must comply with Google's developer policies, including target API level requirements, content rating, and data safety form disclosures.
- **Web Application:** The Angular-based web client must be deployable as a static web application, served over HTTPS without requiring any client-side installation or configuration. The build artifact must be optimized for production (minification, tree-shaking, cache-busting) and hosted on infrastructure managed within the AWS environment.

## Build and Release Constraints

- Each client must maintain a dedicated, reproducible build pipeline integrated into the CI/CD workflow defined in section 3.3.5. Release builds must be triggered explicitly and must not be produced as a side effect of regular development pipelines.
- Version numbering must follow [Semantic Versioning](https://semver.org/) and be consistent across all distributed artifacts for a given release.
- Release notes must accompany each store submission and web deployment, summarizing changes in language accessible to end users.

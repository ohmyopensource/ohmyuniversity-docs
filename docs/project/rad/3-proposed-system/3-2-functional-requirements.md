---
title: RAD - 3.2 Functional Requirements | OhMyUniversity!
description: Functional requirements of OhMyUniversity - organized into logical modules covering academic career, external university services, logistics, orientation, and extra student services.
head:
  - - meta
    - property: og:title
      content: RAD - 3.2 Functional Requirements | OhMyUniversity!
  - - meta
    - property: og:description
      content: Functional requirements of OhMyUniversity - organized into logical modules covering academic career, external university services, logistics, orientation, and extra student services.
  - - meta
    - property: og:url
      content: https://docs.university.ohmyopensource.org/project/rad/3-proposed-system/3-2-functional-requirements
  - - meta
    - name: keywords
      content: ohmyuniversity, rad, functional requirements, requirements analysis, university app, cineca, esse3, moodle, student services, academic career, logistics, orientation, middleware, student portal
  - - meta
    - name: twitter:title
      content: RAD - 3.2 Functional Requirements | OhMyUniversity!
  - - meta
    - name: twitter:description
      content: Functional requirements of OhMyUniversity - organized into modules for academic career, external university services, logistics, orientation, and extra student services.
---

# OhMyUniversity! - RAD: 3.2 Functional Requirements

The functional requirements of **OhMyUniversity!** are organized into logical modules that reflect the main operational areas of the application.

---

### 3.2.1 Module 1: Career, Didactics, and Student Administration Office (Core Integration)

| ID       | Requirement                  | Description                                                                                                                                           |
| -------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1.1.1 | Career Synchronization       | The system must retrieve student record book data, including exams, grades, and ECTS, through integration with Cineca/Esse3 APIs.                     |
| FR-1.1.2 | Grade Calculation            | The system must automatically calculate the arithmetic average and the weighted average based on registered grades.                                   |
| FR-1.1.3 | Graduation Projection        | The system must calculate the graduation base score expressed out of one hundred ten (/110).                                                          |
| FR-1.1.4 | Progress Tracking            | The system must show the count of exams passed compared to the total and the percentage of ECTS acquired.                                             |
| FR-1.1.5 | Trend Analysis               | The system must generate graphs related to the trend of grades and average over time.                                                                 |
| FR-1.1.6 | Study Plan                   | The system must allow the visualization of compulsory and optional courses and the management of elective exams.                                      |
| FR-1.1.7 | Exam Session Management      | The system must allow the visualization of available exam sessions, their booking, and the consultation of existing bookings.                         |
| FR-1.1.8 | Administrative Documentation | The system must allow the consultation of calls for applications, the download of scholarship documents, and the visualization of tuition fee status. |
| FR-1.1.9 | Digital Badge                | The system must display the digital university badge with the student's identification data.                                                          |

---

### 3.2.2 Module 2: Access to External University Services

| ID       | Requirement                  | Description                                                                                                                    |
| -------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| FR-1.2.1 | Moodle Integration           | The system must provide direct access to courses and learning materials available on the Moodle platform.                      |
| FR-1.2.2 | Institutional Email          | The system must allow access to and consultation of the institutional email inbox.                                             |
| FR-1.2.3 | Library Services             | The system must provide links for consulting the resources of the university library.                                          |
| FR-1.2.4 | Optimized Esse3 Exam Booking | The system must provide an optimized view for exam sessions, helping the student identify the most favorable booking sequence. |

---

### 3.2.3 Module 3: Organization and Logistics

| ID       | Requirement                     | Description                                                                                                           |
| -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| FR-1.3.1 | Educational Material Management | The system must allow the visualization and download of slides and PDF files uploaded by teachers.                    |
| FR-1.3.2 | Classroom Capacity and Booking  | The system must allow authorized users to view classroom capacity, check availability, and proceed with booking.      |
| FR-1.3.3 | Class Timetable                 | The system must allow the visualization of PDFs related to classroom occupation timetables.                           |
| FR-1.3.4 | Integrated Calendar             | The system must manage a calendar for displaying commitments, academic events, and deadlines.                         |
| FR-1.3.5 | Attendance Monitoring           | The system must show registered attendances and allow the monitoring of attendance for educational activities.        |
| FR-1.3.6 | Maps and Transport              | The system must integrate maps for locating university sites and provide information on connected means of transport. |
| FR-1.3.7 | University Canteen Menu Display | The system must daily show users the menu planned at the university canteen.                                          |
| FR-1.3.8 | University Canteen Seat Booking | The system must allow students to book a seat in the canteen for a specific time slot.                                |
| FR-1.3.9 | Canteen Concessions Management  | The system must manage conventions for free meals by entering and validating the user's Fiscal Code.                  |

---

### 3.2.4 Module 4: Orientation and Future Planning

| ID       | Requirement           | Description                                                                                                                                     |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1.4.1 | Master's Requirements | The system must show the access requirements for Master's degrees and allow the interactive selection of these requirements through checkboxes. |
| FR-1.4.2 | Eligibility Analysis  | The system must calculate the percentage of completion of the requirements for access to the selected Master's degree.                          |
| FR-1.4.3 | Enrollment Guide      | The system must provide support and guides on enrollment procedures and the university's course catalog.                                        |

---

### 3.2.5 Module 5: Information and Extra Services

| ID       | Requirement         | Description                                                                                       |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| FR-1.5.1 | News Board          | The system must display official news and notices published by the university.                    |
| FR-1.5.2 | Agreements and Jobs | The system must show job advertisements, agreements, discounts, and events dedicated to students. |
| FR-1.5.3 | Quick Access        | The system must allow the configuration of quick links to the most used services and sections.    |
| FR-1.5.4 | Chat System         | The system must allow textual communication between application users.                            |

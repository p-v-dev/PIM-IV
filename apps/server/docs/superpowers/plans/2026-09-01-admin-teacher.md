# Admin And Teacher Implementation Plan

**Goal:** Allow administrators to manage admin/teacher accounts and teachers to create exams.

**Architecture:** Keep one user entity with a role and active flag. Use JWT and role guards for authorization. Store exam questions as JSON to avoid unnecessary entities.

## Tasks

- [ ] Add user roles, active status, and user service operations with tests.
- [ ] Add JWT and role authorization with tests.
- [ ] Seed the initial administrator and add admin user-management endpoints with tests.
- [ ] Add the exam entity and teacher exam-creation endpoint with tests.
- [ ] Run the full test suite, lint, and build.

# Student Accounts Design

## Scope

Add the `student` role to the existing user model. Students cannot register themselves; an administrator creates their accounts.

## Authorization

Administrators create students through the existing `POST /users` endpoint. Students authenticate through `POST /auth/login` and use the same JWT and active-account checks as other users.

## Exam Listing

Authenticated students use `GET /exams`. The endpoint returns only exams whose deadline is later than the current time. It does not expose answer attempts, submissions, scores, question-bank management, or exam creation.

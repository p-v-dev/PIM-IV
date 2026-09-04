# Admin And Teacher Design

## Scope

Implement only `admin` and `teacher` users. Students, exam attempts, public registration, exam editing, and exam publication are out of scope.

## Users

`User` gains immutable `role` (`admin` or `teacher`) and `isActive`. The initial admin is seeded from `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. An authenticated admin can create users, list users, edit name/email/password, and deactivate users. Deactivated users cannot log in or access protected routes.

## Authorization

JWTs include the user's id, email, and role. A JWT guard validates the token and current active status; a simple roles guard restricts admin and teacher endpoints.

## Exams

Teachers create exams with title, description, deadline, and multiple-choice questions. Each question has at least two options and one correct option. Questions are stored as JSON in the exam record.

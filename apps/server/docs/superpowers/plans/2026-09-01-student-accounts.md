# Student Accounts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow administrators to create student accounts and students to list future exams.

**Architecture:** Extend the existing user role union and creation DTO with `student`. Add an exam query filtered in SQL by the current time and expose it through a student-only route.

**Tech Stack:** NestJS, TypeORM, SQL Server, class-validator, Vitest.

## Global Constraints

- Students cannot self-register.
- Students only see exams with deadlines later than the request time.
- Attempts, answers, scores, and student access to questions are out of scope.

---

### Task 1: Student Role

**Files:**
- Modify: `src/users/user.entity.ts`, `src/auth/dto/create-user.dto.ts`
- Modify: `src/auth/auth.service.spec.ts`

- [ ] Add a failing test that creates a user with role `student`.
- [ ] Run `npm test -- src/auth/auth.service.spec.ts`.
- [ ] Add `student` to the role type and DTO validation.
- [ ] Run `npm test -- src/auth/auth.service.spec.ts`.

### Task 2: Future Exam Listing

**Files:**
- Modify: `src/exam/exam.service.ts`, `src/exam/exam.controller.ts`, `src/exam/exam.service.spec.ts`

- [ ] Add a failing test that verifies `findFuture` queries for deadlines later than a supplied current time.
- [ ] Run `npm test -- src/exam/exam.service.spec.ts`.
- [ ] Implement `ExamService.findFuture()` and `GET /exams` restricted to `student`.
- [ ] Run `npm test -- src/exam/exam.service.spec.ts`.

### Task 3: Verify

- [ ] Run `npm test`, `npm run lint`, and `npm run build`.

# Exam Attempts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let students submit repeatable exam attempts and receive an immediate score.

**Architecture:** Add one `Attempt` entity with answer JSON and calculated score. Validate the active exam and submitted question IDs against the fixed question bank before saving.

**Tech Stack:** NestJS, TypeORM, SQL Server, class-validator, Vitest.

## Global Constraints

- Only students submit attempts.
- Expired exams reject submissions.
- Every valid submission is saved; there is no limit.
- Drafts, ranking, and history endpoints are out of scope.

---

### Task 1: Attempt Submission

**Files:**
- Modify: `src/attempt/*`, `src/exam/exam.service.ts`, `src/exam/exam.module.ts`
- Create: `src/attempt/attempt.entity.ts`, `src/attempt/dto/submit-attempt.dto.ts`
- Test: `src/attempt/attempt.service.spec.ts`

- [ ] Write failing tests for scoring a valid attempt and rejecting an expired exam.
- [ ] Run `npm test -- src/attempt/attempt.service.spec.ts`.
- [ ] Add the entity, answer DTO, validation, scoring, persistence, and student-only `POST /exams/:examId/attempts`.
- [ ] Run `npm test -- src/attempt/attempt.service.spec.ts`.

### Task 2: Verify

- [ ] Run `npm test`, `npm run lint`, and `npm run build`.

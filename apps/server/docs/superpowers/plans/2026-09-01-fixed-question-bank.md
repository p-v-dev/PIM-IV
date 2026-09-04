# Fixed Question Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide a seeded shared question bank that teachers select by id when creating exams.

**Architecture:** Add a `Question` entity and an idempotent seed with one question. Replace embedded exam question JSON with selected question ids, validating every id at exam creation.

**Tech Stack:** NestJS, TypeORM, SQL Server, class-validator, Vitest.

## Global Constraints

- The bank is shared and fixed; no question CRUD endpoints exist.
- The seed contains one pt-BR question with four options and one correct option.
- Only authenticated teachers list questions and create exams.

---

### Task 1: Question Bank And Seed

**Files:**
- Create: `src/question/question.entity.ts`, `src/question/question.service.ts`, `src/question/question.controller.ts`, `src/question/question.module.ts`, `src/question/question-seed.service.ts`
- Create: `src/question/question.service.spec.ts`

- [ ] Write a failing service test proving the seed creates the initial question only when its prompt is absent.
- [ ] Run `npm test -- src/question/question.service.spec.ts` and confirm it fails because the service is absent.
- [ ] Add `Question` (`id`, `prompt`, `options`, `correctOptionIndex`), idempotent seed, and teacher-only `GET /questions`.
- [ ] Run `npm test -- src/question/question.service.spec.ts` and confirm it passes.

### Task 2: Select Questions For Exams

**Files:**
- Modify: `src/exam/exam.entity.ts`, `src/exam/dto/create-exam.dto.ts`, `src/exam/exam.service.ts`, `src/exam/exam.module.ts`
- Modify: `src/exam/exam.service.spec.ts`

- [ ] Write failing tests for persisting valid `questionIds` and rejecting unknown ids.
- [ ] Run `npm test -- src/exam/exam.service.spec.ts` and confirm the new cases fail.
- [ ] Replace `questions` JSON in `Exam` with `questionIds`; inject `QuestionService` into `ExamService` and reject unknown ids with `BadRequestException`.
- [ ] Run `npm test -- src/exam/exam.service.spec.ts` and confirm it passes.

### Task 3: Verify

**Files:**
- Test: `src/question/question.service.spec.ts`, `src/exam/exam.service.spec.ts`

- [ ] Run `npm test`, `npm run lint`, and `npm run build`.

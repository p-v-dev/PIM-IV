# Fixed Question Bank Design

## Scope

The application has a shared, fixed question bank. It is populated only by an idempotent seed; no user can create, edit, or delete questions.

## Questions

Each question has an id, prompt, four options, and one correct option index. The initial seed contains: "Qual é a capital do Brasil?" with the options "Rio de Janeiro", "São Paulo", "Brasília", and "Salvador"; the correct option is "Brasília".

## Use In Exams

Authenticated teachers list the bank through `GET /questions`. Creating an exam receives `questionIds`; the service rejects any id that does not exist and stores the ids in the exam.

## Out Of Scope

Question CRUD, question categories, random selection, and student attempts are not included.

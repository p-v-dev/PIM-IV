# Exam Attempts Design

## Scope

Students submit and repeat attempts for active exams. Each submission is saved and returns its score immediately.

## Attempt

An attempt stores its id, student id, exam id, submitted answers, score, total question count, and creation time. Each answer contains a question id and selected option index.

## Submission

Students submit `POST /exams/:examId/attempts`. The API rejects expired exams, unknown questions, questions outside the exam, invalid option indexes, and duplicate answers for the same question. It compares answers to the fixed question bank and returns the score.

## Reattempts

There is no attempt limit. Every valid submission creates a new record and preserves history.

## Out Of Scope

Drafts, editing attempts, limiting attempts, rankings, and a separate attempt-history route are not included.

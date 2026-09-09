# UML do Backend

```text
+-----------+
| AppModule |
+-----------+
      |
      +--> AuthModule -------> UsersModule
      |      |                    |
      |      +--> AuthController  +--> UsersController
      |      +--> AuthService ----+--> UsersService --> User
      |
      +--> ExamModule -------> AuthModule
      |      |
      |      +--> ExamController --> ExamService --> Exam
      |                               |
      |                               +--> QuestionService --> Question
      |
      +--> QuestionModule ----> AuthModule
      |      |
      |      +--> QuestionController --> QuestionService --> Question
      |
      +--> AttemptModule -----> AuthModule
             |
             +--> AttemptController --> AttemptService --> Attempt
                                       |        |
                                       |        +--> Exam
                                       +--> QuestionService --> Question

+--------------------------------+     +--------------------------------+
| User                           |     | Exam                           |
+--------------------------------+     +--------------------------------+
| id: string                     |     | id: string                     |
| name: string                   |     | teacherId: string               |
| email: string                  |     | title: string                   |
| passwordHash: string           |     | description: string             |
| role: admin | teacher | student |     | deadline: Date                  |
| isActive: boolean              |     | questionIds: string[]          |
+--------------------------------+     | createdAt: Date                 |
                                   +--------------------------------+

+--------------------------------+
| Question                       |
+--------------------------------+
| id: string                     |
| prompt: string                 |
| options: string[]              |
| correctOptionIndex: number     |
+--------------------------------+

+--------------------------------+
| Attempt                        |
+--------------------------------+
| id: string                     |
| studentId: string              |
| examId: string                 |
| answers: Answer[]              |
| score: number                  |
| totalQuestions: number         |
| createdAt: Date                |
+--------------------------------+

Referencias por identificador:

Exam.teacherId ...........> User
Exam.questionIds .........> Question
Attempt.studentId ........> User
Attempt.examId ...........> Exam
```

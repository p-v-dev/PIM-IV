import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v7 } from 'uuid';
import { QueryFailedError, Repository } from 'typeorm';
import { Exam } from '../exam/exam.entity.js';
import { QuestionService } from '../question/question.service.js';
import { Attempt } from './attempt.entity.js';
import { User } from '../users/user.entity.js';

const POINTS_PER_CORRECT_ANSWER = 10;

@Injectable()
export class AttemptService {
  constructor(@InjectRepository(Attempt) private readonly repository: Repository<Attempt>, @InjectRepository(Exam) private readonly exams: Repository<Exam>, private readonly questions: QuestionService, @InjectRepository(User) private readonly users: Repository<User>) {}
  async submit(studentId: string, examId: string, answers: Attempt['answers']) {
    const exam = await this.exams.findOneBy({ id: examId });
    if (!exam || exam.isActive === false || exam.deadline <= new Date()) throw new BadRequestException('Exam unavailable');
    if (await this.repository.existsBy({ studentId, examId })) throw new ConflictException('Exam already attempted');
    if (answers.length !== exam.questionIds.length || new Set(answers.map((a) => a.questionId.toLowerCase())).size !== answers.length) throw new BadRequestException('Invalid answers');
    const questions = await this.questions.findByIds(exam.questionIds);
    const byId = new Map(questions.map((question) => [question.id.toLowerCase(), question]));
    if (questions.length !== exam.questionIds.length || answers.some((answer) => {
      const question = byId.get(answer.questionId.toLowerCase());
      return !question || !Number.isInteger(answer.selectedOptionIndex) || answer.selectedOptionIndex < 0 || answer.selectedOptionIndex >= question.options.length;
    })) throw new BadRequestException('Invalid answers');
    const score = answers.filter((answer) => byId.get(answer.questionId.toLowerCase())!.correctOptionIndex === answer.selectedOptionIndex).length;
    try {
      return await this.repository.manager.transaction(async (manager) => {
        const attempt = await manager.save(Attempt, this.repository.create({ id: v7(), studentId, examId, answers, score, totalQuestions: questions.length }));
        const pointsEarned = score * POINTS_PER_CORRECT_ANSWER;
        await manager.increment(User, { id: studentId }, 'points', pointsEarned);
        return { ...attempt, pointsEarned };
      });
    } catch (error) {
      const number = error instanceof QueryFailedError ? (error.driverError as { number?: number }).number : undefined;
      if (number === 2601 || number === 2627) throw new ConflictException('Exam already attempted');
      throw error;
    }
  }

  findByStudent(studentId: string) {
    // ponytail: historico completo; paginar se o volume exigir.
    return this.repository.createQueryBuilder('attempt')
      .innerJoin(Exam, 'exam', 'exam.id = attempt.examId')
      .select('attempt.id', 'id')
      .addSelect('attempt.examId', 'examId')
      .addSelect('exam.title', 'title')
      .addSelect('attempt.score', 'score')
      .addSelect('attempt.totalQuestions', 'totalQuestions')
      .addSelect('attempt.createdAt', 'createdAt')
      .where('attempt.studentId = :studentId', { studentId })
      .orderBy('attempt.createdAt', 'DESC')
      .addOrderBy('attempt.id', 'DESC')
      .getRawMany<{ id: string; examId: string; title: string; score: number; totalQuestions: number; createdAt: Date }>();
  }

  async findByExam(teacherId: string, examId: string) {
    const exam = await this.exams.findOneBy({ id: examId, teacherId });
    if (!exam) throw new NotFoundException('Exam not found');

    return this.repository.createQueryBuilder('attempt')
      .innerJoin(User, 'student', 'student.id = attempt.studentId')
      .select('attempt.id', 'id')
      .addSelect('attempt.examId', 'examId')
      .addSelect('attempt.studentId', 'studentId')
      .addSelect('student.name', 'studentName')
      .addSelect('attempt.score', 'score')
      .addSelect('attempt.totalQuestions', 'totalQuestions')
      .addSelect('attempt.createdAt', 'createdAt')
      .where('attempt.examId = :examId', { examId })
      .orderBy('attempt.createdAt', 'DESC')
      .addOrderBy('attempt.id', 'DESC')
      .getRawMany<{ id: string; examId: string; studentId: string; studentName: string; score: number; totalQuestions: number; createdAt: Date }>();
  }

  getLeaderboard() {
    return this.users.createQueryBuilder('user')
      .select('user.id', 'studentId')
      .addSelect('user.name', 'name')
      .addSelect('user.points', 'points')
      .where('user.role = :role', { role: 'student' })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .orderBy('points', 'DESC')
      .addOrderBy('user.name', 'ASC')
      .addOrderBy('user.id', 'ASC')
      .limit(20)
      .getRawMany<{ studentId: string; name: string; points: number }>();
  }
}

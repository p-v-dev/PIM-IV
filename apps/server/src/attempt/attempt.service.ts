import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v7 } from 'uuid';
import { QueryFailedError, Repository } from 'typeorm';
import { Exam } from '../exam/exam.entity.js';
import { QuestionService } from '../question/question.service.js';
import { Attempt } from './attempt.entity.js';

const POINTS_PER_CORRECT_ANSWER = 10;

@Injectable()
export class AttemptService {
  constructor(@InjectRepository(Attempt) private readonly repository: Repository<Attempt>, @InjectRepository(Exam) private readonly exams: Repository<Exam>, private readonly questions: QuestionService) {}
  async submit(studentId: string, examId: string, answers: Attempt['answers']) {
    const exam = await this.exams.findOneBy({ id: examId });
    if (!exam || exam.deadline <= new Date()) throw new BadRequestException('Exam unavailable');
    if (await this.repository.existsBy({ studentId, examId })) throw new ConflictException('Exam already attempted');
    if (answers.length !== exam.questionIds.length || new Set(answers.map((a) => a.questionId)).size !== answers.length) throw new BadRequestException('Invalid answers');
    const questions = await this.questions.findByIds(exam.questionIds);
    if (questions.length !== exam.questionIds.length || answers.some((a) => !exam.questionIds.includes(a.questionId) || a.selectedOptionIndex >= questions.find((q) => q.id === a.questionId)!.options.length)) throw new BadRequestException('Invalid answers');
    const score = answers.filter((a) => questions.find((q) => q.id === a.questionId)!.correctOptionIndex === a.selectedOptionIndex).length;
    try {
      const attempt = await this.repository.save(this.repository.create({ id: v7(), studentId, examId, answers, score, totalQuestions: questions.length }));
      return { ...attempt, pointsEarned: score * POINTS_PER_CORRECT_ANSWER };
    } catch (error) {
      const number = error instanceof QueryFailedError ? (error.driverError as { number?: number }).number : undefined;
      if (number === 2601 || number === 2627) throw new ConflictException('Exam already attempted');
      throw error;
    }
  }

  getLeaderboard() {
    return this.repository.createQueryBuilder('attempt')
      .innerJoin('users', 'user', 'user.id = attempt.studentId')
      .select('attempt.studentId', 'studentId')
      .addSelect('user.name', 'name')
      .addSelect(`SUM(attempt.score) * ${POINTS_PER_CORRECT_ANSWER}`, 'points')
      .where('user.role = :role', { role: 'student' })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .groupBy('attempt.studentId')
      .addGroupBy('user.name')
      .orderBy('points', 'DESC')
      .addOrderBy('user.name', 'ASC')
      .addOrderBy('attempt.studentId', 'ASC')
      .limit(20)
      .getRawMany<{ studentId: string; name: string; points: number }>();
  }
}

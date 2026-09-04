import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v7 } from 'uuid';
import { Repository } from 'typeorm';
import { Exam } from '../exam/exam.entity.js';
import { QuestionService } from '../question/question.service.js';
import { Attempt } from './attempt.entity.js';

@Injectable()
export class AttemptService {
  constructor(@InjectRepository(Attempt) private readonly repository: Repository<Attempt>, @InjectRepository(Exam) private readonly exams: Repository<Exam>, private readonly questions: QuestionService) {}
  async submit(studentId: string, examId: string, answers: Attempt['answers']) {
    const exam = await this.exams.findOneBy({ id: examId });
    if (!exam || exam.deadline <= new Date()) throw new BadRequestException('Exam unavailable');
    if (answers.length !== exam.questionIds.length || new Set(answers.map((a) => a.questionId)).size !== answers.length) throw new BadRequestException('Invalid answers');
    const questions = await this.questions.findByIds(exam.questionIds);
    if (questions.length !== exam.questionIds.length || answers.some((a) => !exam.questionIds.includes(a.questionId) || a.selectedOptionIndex >= questions.find((q) => q.id === a.questionId)!.options.length)) throw new BadRequestException('Invalid answers');
    const score = answers.filter((a) => questions.find((q) => q.id === a.questionId)!.correctOptionIndex === a.selectedOptionIndex).length;
    return this.repository.save(this.repository.create({ id: v7(), studentId, examId, answers, score, totalQuestions: questions.length }));
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v7 } from 'uuid';
import { MoreThan, Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { Exam } from './exam.entity.js';
import { QuestionService } from '../question/question.service.js';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam) private readonly repository: Repository<Exam>,
    private readonly questionService: QuestionService,
  ) {}

  async create(teacherId: string, dto: CreateExamDto) {
    const deadline = new Date(dto.deadline);
    if (!Number.isFinite(deadline.getTime()) || deadline.getTime() <= Date.now()) {
      throw new BadRequestException('Deadline must be in the future');
    }
    if (!dto.title.trim() || !dto.description.trim()) {
      throw new BadRequestException('Title and description are required');
    }
    const questions = await this.questionService.findByIds(dto.questionIds);
    if (questions.length !== dto.questionIds.length) {
      throw new BadRequestException('Question not found');
    }
    return this.repository.save(
      this.repository.create({
        id: v7(),
        teacherId,
        title: dto.title.trim(),
        description: dto.description.trim(),
        deadline,
        questionIds: dto.questionIds,
        isActive: true,
      }),
    );
  }

  findFuture(now = new Date()) {
    return this.repository.findBy({ deadline: MoreThan(now), isActive: true });
  }

  findByTeacher(teacherId: string) {
    return this.repository.find({ where: { teacherId }, order: { createdAt: 'DESC' } });
  }

  async deactivate(teacherId: string, id: string) {
    const exam = await this.repository.findOneBy({ id, teacherId });
    if (!exam) throw new NotFoundException('Exam not found');
    return this.repository.save({ ...exam, isActive: false });
  }

  async findForStudent(id: string) {
    const exam = await this.repository.findOneBy({ id });
    if (!exam || exam.isActive === false || exam.deadline <= new Date() || !exam.questionIds.length) {
      throw new NotFoundException('Exam unavailable');
    }
    const questions = await this.questionService.findByIds(exam.questionIds);
    if (questions.length !== exam.questionIds.length) throw new NotFoundException('Exam unavailable');
    const byId = new Map(questions.map((question) => [question.id.toLowerCase(), question]));
    return {
      id: exam.id,
      title: exam.title,
      description: exam.description,
      deadline: exam.deadline,
      questions: exam.questionIds.map((questionId) => {
        const question = byId.get(questionId.toLowerCase());
        if (!question) throw new NotFoundException('Exam unavailable');
        return { id: question.id, prompt: question.prompt, options: question.options };
      }),
    };
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
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
    const questions = await this.questionService.findByIds(dto.questionIds);
    if (questions.length !== dto.questionIds.length) {
      throw new BadRequestException('Question not found');
    }
    return this.repository.save(
      this.repository.create({
        id: v7(),
        teacherId,
        title: dto.title,
        description: dto.description,
        deadline: new Date(dto.deadline),
        questionIds: dto.questionIds,
      }),
    );
  }

  findFuture(now = new Date()) {
    return this.repository.findBy({ deadline: MoreThan(now) });
  }
}

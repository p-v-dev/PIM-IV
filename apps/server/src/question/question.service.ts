import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v7 } from 'uuid';
import { In, Repository } from 'typeorm';
import { Question } from './question.entity.js';

const initialQuestion = {
  prompt: 'Qual é a capital do Brasil?',
  options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'],
  correctOptionIndex: 2,
};

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private readonly repository: Repository<Question>,
  ) {}

  findAll() {
    return this.repository.find();
  }

  findByIds(ids: string[]) {
    return this.repository.findBy({ id: In(ids) });
  }

  async seedInitialQuestion() {
    if (await this.repository.findOneBy({ prompt: initialQuestion.prompt })) return;
    await this.repository.save(this.repository.create({ id: v7(), ...initialQuestion }));
  }
}

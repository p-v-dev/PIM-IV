import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { QuestionService } from './question.service.js';

@Injectable()
export class QuestionSeedService implements OnApplicationBootstrap {
  constructor(private readonly questionService: QuestionService) {}

  onApplicationBootstrap() {
    return this.questionService.seedInitialQuestion();
  }
}

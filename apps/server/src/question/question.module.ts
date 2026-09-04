import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { QuestionController } from './question.controller.js';
import { Question } from './question.entity.js';
import { QuestionSeedService } from './question-seed.service.js';
import { QuestionService } from './question.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), AuthModule],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionSeedService],
  exports: [QuestionService],
})
export class QuestionModule {}

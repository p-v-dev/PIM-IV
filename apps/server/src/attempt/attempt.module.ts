import { Module } from '@nestjs/common';
import { AttemptController } from './attempt.controller.js';
import { AttemptService } from './attempt.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from './attempt.entity.js';
import { Exam } from '../exam/exam.entity.js';
import { QuestionModule } from '../question/question.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt, Exam]), QuestionModule, AuthModule],
  controllers: [AttemptController],
  providers: [AttemptService],
})
export class AttemptModule {}

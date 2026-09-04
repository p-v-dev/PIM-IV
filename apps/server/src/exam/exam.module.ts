import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller.js';
import { ExamService } from './exam.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './exam.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { QuestionModule } from '../question/question.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), AuthModule, QuestionModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}

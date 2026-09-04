import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { ExamService } from './exam.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('exams')
@ApiTags('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @ApiBody({ schema: { type: 'object' }, examples: { exam: { value: { title: 'Avaliação Demo', description: 'Avaliação para demonstração.', deadline: '2030-12-31T23:59:59.000Z', questionIds: ['id-da-questao'] } } } })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateExamDto) {
    return this.examService.create(request.user.id, dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  findFuture() {
    return this.examService.findFuture();
  }
}

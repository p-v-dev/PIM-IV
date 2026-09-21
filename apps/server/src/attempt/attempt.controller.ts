import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { SubmitAttemptDto } from './dto/submit-attempt.dto.js';
import { AttemptService } from './attempt.service.js';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('exams/:examId/attempts')
@ApiTags('attempts')
@ApiBearerAuth()
export class AttemptController { constructor(private readonly attempts: AttemptService) {} @Post() @ApiBody({ schema: { type: 'object' }, examples: { answer: { value: { answers: [{ questionId: 'id-da-questao', selectedOptionIndex: 2 }] } } } }) @UseGuards(JwtAuthGuard, RolesGuard) @Roles('student') submit(@Req() request: AuthenticatedRequest, @Param('examId') examId: string, @Body() dto: SubmitAttemptDto) { return this.attempts.submit(request.user.id, examId, dto.answers); } }

@Controller('leaderboard')
@ApiTags('leaderboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher', 'student')
export class LeaderboardController {
  constructor(private readonly attempts: AttemptService) {}

  @Get()
  findAll() {
    return this.attempts.getLeaderboard();
  }
}

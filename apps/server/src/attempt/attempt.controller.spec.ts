import { ROLES_KEY } from '../auth/roles.decorator.js';
import { AttemptController, LeaderboardController, StudentAttemptsController } from './attempt.controller.js';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';

describe('AttemptController', () => {
  it('is defined', () => {
    const controller = new AttemptController({} as never);
    expect(controller).toBeDefined();
  });
});

describe('LeaderboardController', () => {
  it('returns the leaderboard for teachers and students', async () => {
    const leaderboard = [{ studentId: 'student', name: 'Ana', points: 70 }];
    const attempts = { getLeaderboard: vi.fn().mockResolvedValue(leaderboard) };
    const controller = new LeaderboardController(attempts as never);

    await expect(controller.findAll()).resolves.toEqual(leaderboard);
    expect(Reflect.getMetadata(ROLES_KEY, LeaderboardController)).toEqual(['teacher', 'student']);
  });
});

describe('StudentAttemptsController', () => {
  it('uses only the authenticated identity and restricts access to students', async () => {
    const history = [{ id: 'attempt', examId: 'exam', title: 'Title', score: 1, totalQuestions: 2, createdAt: '2026-01-01' }];
    const attempts = { findByStudent: vi.fn().mockResolvedValue(history) };
    const controller = new StudentAttemptsController(attempts as never);
    await expect(controller.findMine({ user: { id: 'student-id' }, query: { studentId: 'other-student' } } as never)).resolves.toEqual(history);
    expect(attempts.findByStudent).toHaveBeenCalledWith('student-id');
    expect(Reflect.getMetadata(ROLES_KEY, StudentAttemptsController)).toEqual(['student']);
    expect(Reflect.getMetadata(GUARDS_METADATA, StudentAttemptsController)).toEqual([JwtAuthGuard, RolesGuard]);
  });
});

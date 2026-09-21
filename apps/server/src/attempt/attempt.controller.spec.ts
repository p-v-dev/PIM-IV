import { ROLES_KEY } from '../auth/roles.decorator.js';
import { AttemptController, LeaderboardController } from './attempt.controller.js';

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

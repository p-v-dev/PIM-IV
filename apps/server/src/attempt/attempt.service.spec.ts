import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { AttemptService } from './attempt.service.js';

describe('AttemptService', () => {
  const queryBuilder = {
    innerJoin: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    addSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    andWhere: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    addGroupBy: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    addOrderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    getRawMany: vi.fn(),
  };
  const attempts = { create: vi.fn(), save: vi.fn(), existsBy: vi.fn(), createQueryBuilder: vi.fn(() => queryBuilder) };
  const exams = { findOneBy: vi.fn() };
  const questions = { findByIds: vi.fn() };
  const service = new AttemptService(attempts as never, exams as never, questions as never);

  beforeEach(() => {
    vi.clearAllMocks();
    attempts.existsBy.mockResolvedValue(false);
  });

  it('scores a student attempt', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', options: ['A', 'B'], correctOptionIndex: 1 }]);
    attempts.create.mockImplementation((value) => value);
    attempts.save.mockImplementation(async (value) => value);

    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).resolves.toMatchObject({ score: 1, totalQuestions: 1, pointsEarned: 10 });
  });

  it('rejects another attempt for the same exam', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    attempts.existsBy.mockResolvedValue(true);

    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).rejects.toBeInstanceOf(ConflictException);
    expect(attempts.save).not.toHaveBeenCalled();
  });

  it('returns conflict when concurrent attempts hit the unique index', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', options: ['A', 'B'], correctOptionIndex: 1 }]);
    attempts.create.mockImplementation((value) => value);
    attempts.save.mockRejectedValue(new QueryFailedError('', [], { number: 2601 }));

    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns the top 20 active students by points', async () => {
    const leaderboard = [{ studentId: 'student', name: 'Ana', points: 70 }];
    queryBuilder.getRawMany.mockResolvedValue(leaderboard);

    await expect(service.getLeaderboard()).resolves.toEqual(leaderboard);
    expect(queryBuilder.addSelect).toHaveBeenCalledWith('SUM(attempt.score) * 10', 'points');
    expect(queryBuilder.where).toHaveBeenCalledWith('user.role = :role', { role: 'student' });
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('attempt.studentId', 'ASC');
    expect(queryBuilder.limit).toHaveBeenCalledWith(20);
  });
});

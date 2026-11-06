import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError, getMetadataArgsStorage } from 'typeorm';
import { AttemptService } from './attempt.service.js';
import { Attempt } from './attempt.entity.js';
import { User } from '../users/user.entity.js';
import { Exam } from '../exam/exam.entity.js';

describe('AttemptService', () => {
  const queryBuilder = {
    innerJoin: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    addSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    andWhere: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    addOrderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    getRawMany: vi.fn(),
  };
  const manager = { save: vi.fn(), increment: vi.fn() };
  const transaction = vi.fn(async (work) => work(manager));
  const attempts = { create: vi.fn(), save: vi.fn(), existsBy: vi.fn(), manager: { transaction }, createQueryBuilder: vi.fn(() => queryBuilder) };
  const users = { createQueryBuilder: vi.fn(() => queryBuilder) };
  const exams = { findOneBy: vi.fn() };
  const questions = { findByIds: vi.fn() };
  const service = new AttemptService(attempts as never, exams as never, questions as never, users as never);

  beforeEach(() => {
    vi.clearAllMocks();
    attempts.existsBy.mockResolvedValue(false);
    attempts.create.mockImplementation((value) => value);
    manager.save.mockReset().mockImplementation(async (_entity, value) => value);
    manager.increment.mockReset().mockResolvedValue({ affected: 1 });
  });

  it('starts user points at zero without counting previous attempts', () => {
    const column = getMetadataArgsStorage().columns.find((column) => column.target === User && column.propertyName === 'points');
    expect(column?.options.default).toBe(0);
  });

  it('scores a student attempt', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', options: ['A', 'B'], correctOptionIndex: 1 }]);

    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).resolves.toMatchObject({ score: 1, totalQuestions: 1, pointsEarned: 10 });
    expect(transaction).toHaveBeenCalledOnce();
    expect(manager.save).toHaveBeenCalledWith(Attempt, expect.objectContaining({ studentId: 'student', score: 1 }));
    expect(manager.increment).toHaveBeenCalledWith(User, { id: 'student' }, 'points', 10);
    expect(attempts.save).not.toHaveBeenCalled();
  });

  it('rejects another attempt for the same exam', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    attempts.existsBy.mockResolvedValue(true);

    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).rejects.toBeInstanceOf(ConflictException);
    expect(attempts.save).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
    expect(manager.increment).not.toHaveBeenCalled();
  });

  it('returns conflict when concurrent attempts hit the unique index', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', options: ['A', 'B'], correctOptionIndex: 1 }]);
    manager.save.mockRejectedValueOnce(new QueryFailedError('', [], { number: 2601 }));

    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).rejects.toBeInstanceOf(ConflictException);
    expect(manager.increment).not.toHaveBeenCalled();
  });

  it('does not report success if the points update fails', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', options: ['A', 'B'], correctOptionIndex: 1 }]);
    manager.increment.mockRejectedValueOnce(new Error('Database unavailable'));

    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).rejects.toThrow('Database unavailable');
  });

  it('awards no points for an incorrect answer', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', options: ['A', 'B'], correctOptionIndex: 1 }]);

    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 0 }])).resolves.toMatchObject({ score: 0, pointsEarned: 0 });
    expect(manager.increment).toHaveBeenCalledWith(User, { id: 'student' }, 'points', 0);
  });

  it('returns the top 20 active students by points', async () => {
    const leaderboard = [{ studentId: 'student', name: 'Ana', points: 70 }];
    queryBuilder.getRawMany.mockResolvedValue(leaderboard);

    await expect(service.getLeaderboard()).resolves.toEqual(leaderboard);
    expect(users.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(queryBuilder.select).toHaveBeenCalledWith('user.id', 'studentId');
    expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.points', 'points');
    expect(queryBuilder.where).toHaveBeenCalledWith('user.role = :role', { role: 'student' });
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.isActive = :isActive', { isActive: true });
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('user.id', 'ASC');
    expect(queryBuilder.groupBy).not.toHaveBeenCalled();
    expect(queryBuilder.limit).toHaveBeenCalledWith(20);
  });

  it('scores UUIDs consistently across SQL Server casing', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q-a'] });
    questions.findByIds.mockResolvedValue([{ id: 'Q-A', options: ['A', 'B'], correctOptionIndex: 1 }]);
    await expect(service.submit('student', 'exam', [{ questionId: 'Q-A', selectedOptionIndex: 1 }])).resolves.toMatchObject({ score: 1, pointsEarned: 10 });
  });

  it('rejects invalid option indices without saving or changing points', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', options: ['A', 'B'], correctOptionIndex: 1 }]);
    for (const selectedOptionIndex of [-1, 0.5, 2]) {
      await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex }])).rejects.toBeInstanceOf(BadRequestException);
    }
    expect(transaction).not.toHaveBeenCalled();
  });

  it('rejects missing, extra or duplicate answers without awarding points', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', options: ['A', 'B'], correctOptionIndex: 1 }]);
    for (const answers of [[], [{ questionId: 'other', selectedOptionIndex: 1 }], [{ questionId: 'q1', selectedOptionIndex: 1 }, { questionId: 'Q1', selectedOptionIndex: 1 }]]) {
      await expect(service.submit('student', 'exam', answers)).rejects.toBeInstanceOf(BadRequestException);
    }
    expect(transaction).not.toHaveBeenCalled();
  });

  it('rejects unavailable exams without saving or awarding points', async () => {
    for (const exam of [null, { id: 'exam', deadline: new Date('2020-01-01') }]) {
      exams.findOneBy.mockResolvedValue(exam);
      await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).rejects.toBeInstanceOf(BadRequestException);
    }
    expect(transaction).not.toHaveBeenCalled();
  });

  it('selects only the authenticated students history without filtering exam availability', async () => {
    const history = [{ id: 'attempt', examId: 'expired-exam', title: 'Old exam', score: 3, totalQuestions: 4, createdAt: new Date('2020-01-01') }];
    queryBuilder.getRawMany.mockResolvedValue(history);
    await expect(service.findByStudent('student-id')).resolves.toEqual(history);
    expect(attempts.createQueryBuilder).toHaveBeenCalledWith('attempt');
    expect(queryBuilder.innerJoin).toHaveBeenCalledWith(Exam, 'exam', 'exam.id = attempt.examId');
    expect(queryBuilder.select).toHaveBeenCalledExactlyOnceWith('attempt.id', 'id');
    expect(queryBuilder.addSelect.mock.calls).toEqual([
      ['attempt.examId', 'examId'], ['exam.title', 'title'], ['attempt.score', 'score'],
      ['attempt.totalQuestions', 'totalQuestions'], ['attempt.createdAt', 'createdAt'],
    ]);
    expect(queryBuilder.where).toHaveBeenCalledExactlyOnceWith('attempt.studentId = :studentId', { studentId: 'student-id' });
    expect(queryBuilder.andWhere).not.toHaveBeenCalled();
    expect(queryBuilder.orderBy).toHaveBeenCalledWith('attempt.createdAt', 'DESC');
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('attempt.id', 'DESC');
    expect(transaction).not.toHaveBeenCalled();
  });

  it('returns an empty history when the student has no attempts', async () => {
    queryBuilder.getRawMany.mockResolvedValue([]);
    await expect(service.findByStudent('new-student')).resolves.toEqual([]);
  });

  it('rejects inactive exams without saving or awarding points', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', isActive: false, deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).rejects.toBeInstanceOf(BadRequestException);
    expect(transaction).not.toHaveBeenCalled();
    expect(manager.increment).not.toHaveBeenCalled();
  });

  it('returns attempts for an exam owned by the authenticated teacher', async () => {
    const results = [{ id: 'attempt', examId: 'exam-id', studentId: 'student-id', studentName: 'Ana', score: 3, totalQuestions: 4, createdAt: new Date('2026-01-01') }];
    exams.findOneBy.mockResolvedValue({ id: 'exam-id', teacherId: 'teacher-id' });
    queryBuilder.getRawMany.mockResolvedValue(results);

    await expect(service.findByExam('teacher-id', 'exam-id')).resolves.toEqual(results);
    expect(exams.findOneBy).toHaveBeenCalledWith({ id: 'exam-id', teacherId: 'teacher-id' });
    expect(attempts.createQueryBuilder).toHaveBeenCalledWith('attempt');
    expect(queryBuilder.innerJoin).toHaveBeenCalledWith(User, 'student', 'student.id = attempt.studentId');
    expect(queryBuilder.addSelect.mock.calls).toEqual([
      ['attempt.examId', 'examId'], ['attempt.studentId', 'studentId'], ['student.name', 'studentName'],
      ['attempt.score', 'score'], ['attempt.totalQuestions', 'totalQuestions'], ['attempt.createdAt', 'createdAt'],
    ]);
    expect(queryBuilder.where).toHaveBeenCalledWith('attempt.examId = :examId', { examId: 'exam-id' });
    expect(queryBuilder.orderBy).toHaveBeenCalledWith('attempt.createdAt', 'DESC');
    expect(queryBuilder.addOrderBy).toHaveBeenCalledWith('attempt.id', 'DESC');
  });

  it('hides attempts from a teacher who does not own the exam', async () => {
    exams.findOneBy.mockResolvedValue(null);

    await expect(service.findByExam('other-teacher', 'exam-id')).rejects.toBeInstanceOf(NotFoundException);
    expect(attempts.createQueryBuilder).not.toHaveBeenCalled();
  });
});

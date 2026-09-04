import { BadRequestException } from '@nestjs/common';
import { ExamService } from './exam.service.js';

describe('ExamService', () => {
  const repository = { create: vi.fn(), findBy: vi.fn(), save: vi.fn() };
  const questions = { findByIds: vi.fn() };
  const service = new ExamService(repository as never, questions as never);

  beforeEach(() => vi.clearAllMocks());

  it('creates an exam owned by the teacher', async () => {
    const input = {
      title: 'Matemática básica',
      description: 'Avaliação do primeiro módulo',
      deadline: '2026-10-01T12:00:00.000Z',
      questionIds: ['question-id'],
    };
    questions.findByIds.mockResolvedValue([{ id: 'question-id' }]);
    repository.create.mockImplementation((value) => value);
    repository.save.mockImplementation(async (value) => value);

    await expect((service as any).create('teacher-id', input)).resolves.toMatchObject({
      teacherId: 'teacher-id',
      title: 'Matemática básica',
      questionIds: ['question-id'],
    });
  });

  it('rejects an unknown question id', async () => {
    questions.findByIds.mockResolvedValue([]);

    await expect(
      service.create('teacher-id', {
        title: 'Matemática básica',
        description: 'Avaliação do primeiro módulo',
        deadline: '2026-10-01T12:00:00.000Z',
        questionIds: ['unknown-id'],
      } as never),
    ).rejects.toThrow(BadRequestException);
  });

  it('lists only future exams', async () => {
    repository.findBy.mockResolvedValue([]);
    const now = new Date('2026-09-01T12:00:00.000Z');

    await expect((service as any).findFuture(now)).resolves.toEqual([]);
    expect(repository.findBy).toHaveBeenCalledOnce();
  });
});

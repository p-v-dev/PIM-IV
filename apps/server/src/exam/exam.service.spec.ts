import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExamService } from './exam.service.js';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { validateSync } from 'class-validator';

describe('ExamService', () => {
  const repository = { create: vi.fn(), findBy: vi.fn(), find: vi.fn(), findOneBy: vi.fn(), save: vi.fn() };
  const questions = { findByIds: vi.fn() };
  const service = new ExamService(repository as never, questions as never);

  beforeEach(() => {
    vi.clearAllMocks();
    questions.findByIds.mockResolvedValue([{ id: 'question-id' }]);
    repository.create.mockImplementation((value) => value);
    repository.save.mockImplementation(async (value) => value);
  });

  it('creates an exam owned by the teacher', async () => {
    const input = {
      title: 'Matemática básica',
      description: 'Avaliação do primeiro módulo',
      deadline: new Date(Date.now() + 86400000).toISOString(),
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
        deadline: new Date(Date.now() + 86400000).toISOString(),
        questionIds: ['unknown-id'],
      } as never),
    ).rejects.toThrow(BadRequestException);
  });

  it('lists only future exams', async () => {
    repository.findBy.mockResolvedValue([]);
    const now = new Date('2026-09-01T12:00:00.000Z');

    await expect((service as any).findFuture(now)).resolves.toEqual([]);
    expect(repository.findBy).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }));
  });

  it('lists only the authenticated teachers exams, including expired ones, newest first', async () => {
    repository.find.mockResolvedValue([{ id: 'old-exam', deadline: new Date('2020-01-01') }]);
    await expect(service.findByTeacher('teacher-id')).resolves.toHaveLength(1);
    expect(repository.find).toHaveBeenCalledWith({ where: { teacherId: 'teacher-id' }, order: { createdAt: 'DESC' } });
  });

  it('deactivates an exam owned by the teacher without deleting it', async () => {
    repository.findOneBy.mockResolvedValue({ id: 'exam-id', teacherId: 'teacher-id', isActive: true });
    repository.save.mockImplementation(async (value) => value);

    await expect(service.deactivate('teacher-id', 'exam-id')).resolves.toMatchObject({ id: 'exam-id', isActive: false });
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'exam-id', teacherId: 'teacher-id' });
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ id: 'exam-id', isActive: false }));
  });

  it('hides an exam that belongs to another teacher when deactivating', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.deactivate('other-teacher', 'exam-id')).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects invalid or past deadlines before saving', async () => {
    for (const deadline of ['invalid-date', new Date(Date.now() - 1000).toISOString()]) {
      await expect(service.create('teacher-id', { title: 'Title', description: 'Description', deadline, questionIds: ['question-id'] })).rejects.toThrow(BadRequestException);
    }
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects whitespace-only title or description', async () => {
    for (const [title, description] of [['   ', 'Description'], ['Title', '   ']]) {
      await expect(service.create('teacher-id', { title, description, deadline: new Date(Date.now() + 86400000).toISOString(), questionIds: ['question-id'] })).rejects.toThrow(BadRequestException);
    }
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects invalid UUIDs and duplicate question IDs at the API boundary', () => {
    for (const questionIds of [['not-a-uuid'], ['018f7b6d-54cc-7000-8000-000000000001', '018f7b6d-54cc-7000-8000-000000000001']]) {
      const dto = Object.assign(new CreateExamDto(), { title: 'Title', description: 'Description', deadline: new Date(Date.now() + 86400000).toISOString(), questionIds });
      expect(validateSync(dto).some((error) => error.property === 'questionIds')).toBe(true);
    }
  });

  it('returns only public exam content in the configured order, regardless of UUID casing', async () => {
    const deadline = new Date(Date.now() + 86400000);
    repository.findOneBy.mockResolvedValue({ id: 'exam', teacherId: 'private', title: 'Title', description: 'Description', deadline, questionIds: ['q-b', 'q-a'] });
    questions.findByIds.mockResolvedValue([
      { id: 'Q-A', prompt: 'First', options: ['A', 'B'], correctOptionIndex: 0 },
      { id: 'Q-B', prompt: 'Second', options: ['C', 'D'], correctOptionIndex: 1 },
    ]);
    await expect(service.findForStudent('exam')).resolves.toEqual({
      id: 'exam', title: 'Title', description: 'Description', deadline,
      questions: [{ id: 'Q-B', prompt: 'Second', options: ['C', 'D'] }, { id: 'Q-A', prompt: 'First', options: ['A', 'B'] }],
    });
  });

  it('does not expose missing or expired exams', async () => {
    for (const exam of [null, { id: 'exam', deadline: new Date('2020-01-01'), questionIds: ['q1'] }]) {
      repository.findOneBy.mockResolvedValue(exam);
      await expect(service.findForStudent('exam')).rejects.toBeInstanceOf(NotFoundException);
    }
  });

  it('does not expose inactive exams to students', async () => {
    repository.findOneBy.mockResolvedValue({ id: 'exam', isActive: false, deadline: new Date(Date.now() + 86400000), questionIds: ['q1'] });
    await expect(service.findForStudent('exam')).rejects.toBeInstanceOf(NotFoundException);
    expect(questions.findByIds).not.toHaveBeenCalled();
  });

  it('rejects exam content when a configured question is missing', async () => {
    repository.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date(Date.now() + 86400000), questionIds: ['q1', 'q2'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', prompt: 'Only one', options: ['A', 'B'] }]);
    await expect(service.findForStudent('exam')).rejects.toBeInstanceOf(NotFoundException);
  });
});

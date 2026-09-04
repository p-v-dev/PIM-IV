import { AttemptService } from './attempt.service.js';

describe('AttemptService', () => {
  const attempts = { create: vi.fn(), save: vi.fn() };
  const exams = { findOneBy: vi.fn() };
  const questions = { findByIds: vi.fn() };
  const service = new AttemptService(attempts as never, exams as never, questions as never);

  it('scores a student attempt', async () => {
    exams.findOneBy.mockResolvedValue({ id: 'exam', deadline: new Date('2099-01-01'), questionIds: ['q1'] });
    questions.findByIds.mockResolvedValue([{ id: 'q1', options: ['A', 'B'], correctOptionIndex: 1 }]);
    attempts.create.mockImplementation((value) => value);
    attempts.save.mockImplementation(async (value) => value);

    await expect(service.submit('student', 'exam', [{ questionId: 'q1', selectedOptionIndex: 1 }])).resolves.toMatchObject({ score: 1, totalQuestions: 1 });
  });
});

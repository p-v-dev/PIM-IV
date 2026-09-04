import { QuestionService } from './question.service.js';

describe('QuestionService', () => {
  const repository = { create: vi.fn(), find: vi.fn(), findOneBy: vi.fn(), save: vi.fn() };
  const service = new QuestionService(repository as never);

  beforeEach(() => vi.clearAllMocks());

  it('seeds the initial question only when it is absent', async () => {
    repository.findOneBy
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'question-id' });
    repository.create.mockImplementation((value) => value);
    repository.save.mockImplementation(async (value) => value);

    await service.seedInitialQuestion();
    await service.seedInitialQuestion();

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: 'Qual é a capital do Brasil?',
        options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'],
        correctOptionIndex: 2,
      }),
    );
  });
});

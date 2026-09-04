import { ExamController } from './exam.controller.js';

describe('ExamController', () => {
  it('is defined', () => {
    const controller = new ExamController({} as never);
    expect(controller).toBeDefined();
  });
});

import { ExamController } from './exam.controller.js';
import { ROLES_KEY } from '../auth/roles.decorator.js';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';

describe('ExamController', () => {
  it('is defined', () => {
    const controller = new ExamController({} as never);
    expect(controller).toBeDefined();
  });

  it('lists the authenticated teachers exams with teacher authorization', async () => {
    const exams = { findByTeacher: vi.fn().mockResolvedValue([]) };
    const controller = new ExamController(exams as never);
    await expect(controller.findMine({ user: { id: 'teacher-id' } } as never)).resolves.toEqual([]);
    expect(exams.findByTeacher).toHaveBeenCalledWith('teacher-id');
    expect(Reflect.getMetadata(ROLES_KEY, ExamController.prototype.findMine)).toEqual(['teacher']);
    expect(Reflect.getMetadata(GUARDS_METADATA, ExamController.prototype.findMine)).toEqual([JwtAuthGuard, RolesGuard]);
  });

  it('restricts individual exam content to students', async () => {
    const exams = { findForStudent: vi.fn().mockResolvedValue({ id: 'exam', questions: [] }) };
    const controller = new ExamController(exams as never);
    await expect(controller.findForStudent('exam')).resolves.toMatchObject({ id: 'exam' });
    expect(exams.findForStudent).toHaveBeenCalledWith('exam');
    expect(Reflect.getMetadata(ROLES_KEY, ExamController.prototype.findForStudent)).toEqual(['student']);
    expect(Reflect.getMetadata(GUARDS_METADATA, ExamController.prototype.findForStudent)).toEqual([JwtAuthGuard, RolesGuard]);
  });
});

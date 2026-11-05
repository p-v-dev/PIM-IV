import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from './jwt-auth.guard.js';

describe('AuthController', () => {
  const auth = {
    login: vi.fn(),
    createUser: vi.fn(),
    listUsers: vi.fn(),
    updateUser: vi.fn(),
    deactivateUser: vi.fn(),
    getCurrentUser: vi.fn(),
  };
  const controller = new AuthController(auth as unknown as AuthService);
  const registerDto = {
    name: 'Ana',
    email: 'ana@example.com',
    password: 'password123',
  };
  const loginDto = { email: 'ana@example.com', password: 'password123' };

  beforeEach(() => vi.clearAllMocks());

  it('creates a user with the selected role', async () => {
    const user = { id: 'id', name: 'Ana', email: 'ana@example.com', role: 'teacher' };
    auth.createUser.mockResolvedValue(user);

    await expect(
      controller.createUser({ ...registerDto, role: 'teacher' }),
    ).resolves.toBe(user);
    expect(auth.createUser).toHaveBeenCalledWith(
      registerDto.name,
      registerDto.email,
      registerDto.password,
      'teacher',
    );
  });

  it('delegates login to AuthService', async () => {
    auth.login.mockResolvedValue({ accessToken: 'token' });

    await expect(controller.login(loginDto)).resolves.toEqual({
      accessToken: 'token',
    });
    expect(auth.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
  });

  it('returns the authenticated user from a JWT-protected endpoint', async () => {
    const user = { id: 'student-id', name: 'Ana', role: 'student', points: 0 };
    auth.getCurrentUser.mockResolvedValue(user);
    await expect(controller.me({ user: { id: user.id } } as never)).resolves.toEqual(user);
    expect(auth.getCurrentUser).toHaveBeenCalledWith(user.id);
    expect(Reflect.getMetadata(GUARDS_METADATA, AuthController.prototype.me)).toContain(JwtAuthGuard);
  });
});

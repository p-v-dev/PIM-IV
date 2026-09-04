import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

const scryptAsync = promisify(scrypt);

describe('AuthService', () => {
  const users = { create: vi.fn(), findByEmail: vi.fn() };
  const jwt = { signAsync: vi.fn() };
  const service = new AuthService(
    users as unknown as UsersService,
    jwt as JwtService,
  );
  const password = 'password123';
  const user = {
    id: '018f7b6d-54cc-7000-8000-000000000001',
    name: 'Ana',
    email: 'ana@example.com',
    passwordHash: '',
    role: 'teacher' as const,
    isActive: true,
  };

  beforeEach(() => vi.clearAllMocks());

  async function passwordHash(value: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = await scryptAsync(value, salt, 64);
    return `${salt}:${Buffer.from(hash).toString('hex')}`;
  }

  it('creates a user with the requested role, UUIDv7, and password hash', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockImplementation(async (input) => input);

    const result = await (service as any).createUser(
      'Ana',
      'ana@example.com',
      password,
      'teacher',
    );

    expect(result).toMatchObject({ name: 'Ana', email: 'ana@example.com' });
    expect(result).toMatchObject({ role: 'teacher', isActive: true });
    expect(result).not.toHaveProperty('passwordHash');
    expect(users.create.mock.calls[0][0].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(users.create.mock.calls[0][0].passwordHash).not.toBe(password);
  });

  it('rejects duplicate registration', async () => {
    users.findByEmail.mockResolvedValue(user);

    await expect(
      (service as any).createUser('Ana', user.email, password, 'teacher'),
    ).rejects.toThrow(ConflictException);
  });

  it('creates a student account', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockImplementation(async (input) => input);

    await expect(
      service.createUser('João', 'joao@example.com', password, 'student' as never),
    ).resolves.toMatchObject({ role: 'student', isActive: true });
  });

  it('signs a token for valid credentials', async () => {
    users.findByEmail.mockResolvedValue({
      ...user,
      passwordHash: await passwordHash(password),
    });
    jwt.signAsync.mockResolvedValue('token');

    await expect(service.login(user.email, password)).resolves.toEqual({
      accessToken: 'token',
    });
    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: 'teacher',
    });
  });

  it('rejects an inactive user with valid credentials', async () => {
    users.findByEmail.mockResolvedValue({
      ...user,
      isActive: false,
      passwordHash: await passwordHash(password),
    });

    await expect(service.login(user.email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects invalid credentials', async () => {
    users.findByEmail.mockResolvedValue(null);
    await expect(service.login(user.email, password)).rejects.toThrow(
      UnauthorizedException,
    );

    users.findByEmail.mockResolvedValue({
      ...user,
      passwordHash: await passwordHash(password),
    });
    await expect(service.login(user.email, 'wrong-password')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

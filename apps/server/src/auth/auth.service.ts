import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { v7 } from 'uuid';
import { UsersService } from '../users/users.service.js';
import { User, UserRole } from '../users/user.entity.js';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    if (await this.usersService.findByEmail(email)) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.usersService.create({
      id: v7(),
      name,
      email,
      passwordHash: await this.hashPassword(password),
      role,
      isActive: true,
    });
    return this.publicUser(user);
  }

  async updateUser(
    id: string,
    data: { name?: string; email?: string; password?: string },
  ) {
    if (data.email) {
      const existing = await this.usersService.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new ConflictException('Email already registered');
      }
    }
    const user = await this.usersService.update(id, {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.password && { passwordHash: await this.hashPassword(data.password) }),
    });
    return this.publicUser(user);
  }

  async deactivateUser(id: string) {
    return this.publicUser(await this.usersService.deactivate(id));
  }

  async listUsers() {
    return (await this.usersService.findAll()).map((user) => this.publicUser(user));
  }

  async seedAdmin(name: string, email: string, password: string) {
    if (await this.usersService.findByEmail(email)) return;
    await this.createUser(name, email, password, 'admin');
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (
      !user ||
      !user.isActive ||
      !(await this.passwordMatches(password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${hash.toString('hex')}`;
  }

  private publicUser(user: User) {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }

  private async passwordMatches(password: string, passwordHash: string) {
    const [salt, storedHash] = passwordHash.split(':');
    if (!salt || !storedHash) return false;

    const storedKey = Buffer.from(storedHash, 'hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return (
      storedKey.length === derivedKey.length &&
      timingSafeEqual(storedKey, derivedKey)
    );
  }
}

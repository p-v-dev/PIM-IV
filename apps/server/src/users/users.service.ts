import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  findAll() {
    return this.repository.find();
  }

  async create(user: User) {
    return this.repository.save(this.repository.create(user));
  }

  async update(id: string, user: Partial<User>) {
    const existing = await this.findById(id);
    if (!existing) throw new NotFoundException('User not found');
    return this.repository.save({ ...existing, ...user });
  }

  deactivate(id: string) {
    return this.update(id, { isActive: false });
  }
}

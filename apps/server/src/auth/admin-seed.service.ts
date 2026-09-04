import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async onApplicationBootstrap() {
    await this.authService.seedAdmin(
      this.config.getOrThrow<string>('ADMIN_NAME'),
      this.config.getOrThrow<string>('ADMIN_EMAIL'),
      this.config.getOrThrow<string>('ADMIN_PASSWORD'),
    );
    await this.seedDemoUser('Professor Demo', 'teacher@eduquest.local', 'teacher');
    await this.seedDemoUser('Aluno Demo', 'student@eduquest.local', 'student');
  }

  private async seedDemoUser(name: string, email: string, role: 'teacher' | 'student') {
    try {
      await this.authService.createUser(name, email, 'Demo12345', role);
    } catch (error) {
      if (!(error as { status?: number }).status || (error as { status: number }).status !== 409) throw error;
    }
  }
}

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ExamModule } from './exam/exam.module.js';
import { AttemptModule } from './attempt/attempt.module.js';
import { QuestionModule } from './question/question.module.js';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      autoLoadEntities: true,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      options: { trustServerCertificate: true }, // ponytail: local SQL Server uses a self-signed certificate.
      synchronize: process.env.NODE_ENV === 'development',
    }),
    UsersModule,
    AuthModule,
    ExamModule,
    AttemptModule,
    QuestionModule,
  ],
})
export class AppModule {}

import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import type { UserRole } from '../../users/user.entity.js';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsIn(['admin', 'teacher', 'student'])
  role: UserRole;
}

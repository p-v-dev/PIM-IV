import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { RolesGuard } from './roles.guard.js';
import { Roles } from './roles.decorator.js';

@Controller()
@ApiTags('auth and users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  @ApiBody({ schema: { type: 'object' }, examples: { login: { value: { email: 'admin@eduquest.local', password: 'Admin123!' } } } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('users')
  @ApiBody({ schema: { type: 'object' }, examples: { student: { value: { name: 'Aluno Demo', email: 'novo.aluno@eduquest.local', password: 'Demo12345', role: 'student' } } } })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createUser(@Body() dto: CreateUserDto) {
    return this.authService.createUser(
      dto.name,
      dto.email,
      dto.password,
      dto.role,
    );
  }

  @Get('users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  listUsers() {
    return this.authService.listUsers();
  }

  @Patch('users/:id')
  @ApiBody({ schema: { type: 'object' }, examples: { update: { value: { name: 'Aluno Atualizado', email: 'aluno.atualizado@eduquest.local', password: 'Demo12345' } } } })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.authService.updateUser(id, dto);
  }

  @Patch('users/:id/deactivate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deactivateUser(@Param('id') id: string) {
    return this.authService.deactivateUser(id);
  }
}

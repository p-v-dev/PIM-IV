# User JWT Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add password-based registration and login that issues one-hour JWT access tokens.

**Architecture:** `UsersModule` owns the TypeORM entity and database queries. `AuthModule` validates request DTOs, hashes or verifies passwords with Node's `crypto.scrypt`, and delegates signing to Nest's JWT service. Controllers expose only registration and login; passwords and password hashes are never returned.

**Tech Stack:** NestJS 12, TypeORM with MSSQL, `@nestjs/jwt`, `uuid`, `class-validator`, Node.js `crypto`, Vitest.

## Global Constraints

- User IDs must be UUIDv7 values.
- Email is unique and login responds with `401 Unauthorized` for invalid credentials.
- JWT access tokens use `JWT_SECRET` and expire after exactly `1h`.
- Password hashes must use `crypto.scrypt`; never return a plaintext password or hash.
- Keep the change within `users` and `auth`, except root TypeORM configuration and application validation setup.

---

### Task 1: Add user persistence and DTO validation dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/app.module.ts`
- Modify: `src/main.ts`

**Interfaces:**
- Produces: TypeORM entity auto-discovery; request DTOs validated through Nest's global `ValidationPipe`.

- [ ] **Step 1: Add the required runtime dependencies**

Run: `npm install @nestjs/jwt uuid class-transformer class-validator`

- [ ] **Step 2: Enable entity auto-loading**

In `src/app.module.ts`, add `autoLoadEntities: true` to `TypeOrmModule.forRoot`:

```ts
TypeOrmModule.forRoot({
  type: 'mssql',
  autoLoadEntities: true,
  // existing connection options
})
```

- [ ] **Step 3: Enable input validation and transformation**

In `src/main.ts`, register:

```ts
app.useGlobalPipes(
  new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
);
```

Import `ValidationPipe` from `@nestjs/common`.

- [ ] **Step 4: Build to verify configuration**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/app.module.ts src/main.ts
git commit -m "chore: configure auth dependencies"
```

### Task 2: Create the user entity and repository service

**Files:**
- Create: `src/users/user.entity.ts`
- Modify: `src/users/users.service.ts`
- Modify: `src/users/users.module.ts`
- Modify: `src/users/users.service.spec.ts`

**Interfaces:**
- Produces: `User` with `id`, `name`, `email`, and `passwordHash`; `UsersService.findByEmail(email: string): Promise<User | null>`; `UsersService.create(input: Pick<User, 'id' | 'name' | 'email' | 'passwordHash'>): Promise<User>`.

- [ ] **Step 1: Write failing repository-service tests**

Replace `src/users/users.service.spec.ts` with repository-mocked tests:

```ts
it('finds a user by email', async () => {
  repository.findOneBy.mockResolvedValue(user);
  await expect(service.findByEmail(user.email)).resolves.toBe(user);
  expect(repository.findOneBy).toHaveBeenCalledWith({ email: user.email });
});

it('creates and saves a user', async () => {
  repository.create.mockReturnValue(user);
  repository.save.mockResolvedValue(user);
  await expect(service.create(user)).resolves.toBe(user);
  expect(repository.save).toHaveBeenCalledWith(user);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/users/users.service.spec.ts`
Expected: FAIL because `findByEmail` and `create` do not exist.

- [ ] **Step 3: Implement the minimal entity and service**

Create `User` as an `@Entity('users')` with:

```ts
@PrimaryColumn('uuid')
id: string;

@Column()
name: string;

@Column({ unique: true })
email: string;

@Column()
passwordHash: string;
```

Inject `Repository<User>` into `UsersService` with `@InjectRepository(User)`, implement the two declared methods, and register/export the service in `UsersModule`:

```ts
imports: [TypeOrmModule.forFeature([User])],
exports: [UsersService],
```

- [ ] **Step 4: Run the focused test**

Run: `npm test -- src/users/users.service.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/users
git commit -m "feat: add user persistence"
```

### Task 3: Implement registration and login services

**Files:**
- Modify: `src/auth/auth.service.ts`
- Modify: `src/auth/auth.module.ts`
- Modify: `src/auth/auth.service.spec.ts`

**Interfaces:**
- Consumes: `UsersService.findByEmail` and `UsersService.create` from Task 2.
- Produces: `AuthService.register(name: string, email: string, password: string): Promise<PublicUser>` and `AuthService.login(email: string, password: string): Promise<{ accessToken: string }>`.

- [ ] **Step 1: Write failing auth service tests**

Mock `UsersService` and `JwtService`; add cases for registration, duplicate email, valid login, and invalid credentials:

```ts
beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret';
});

it('registers a user with a UUIDv7 and a password hash', async () => {
  users.findByEmail.mockResolvedValue(null);
  users.create.mockImplementation(async (input) => input);
  const result = await service.register('Ana', 'ana@example.com', 'password123');
  expect(result).toMatchObject({ name: 'Ana', email: 'ana@example.com' });
  expect(result).not.toHaveProperty('passwordHash');
  expect(users.create.mock.calls[0][0].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  expect(users.create.mock.calls[0][0].passwordHash).not.toBe('password123');
});

it('rejects duplicate registration', async () => {
  users.findByEmail.mockResolvedValue(user);
  await expect(service.register('Ana', user.email, 'password123')).rejects.toThrow(ConflictException);
});

it('signs a one-hour token for valid credentials', async () => {
  users.findByEmail.mockResolvedValue(userWithScryptHash);
  jwt.signAsync.mockResolvedValue('token');
  await expect(service.login(userWithScryptHash.email, 'password123')).resolves.toEqual({ accessToken: 'token' });
  expect(jwt.signAsync).toHaveBeenCalledWith({ sub: userWithScryptHash.id, email: userWithScryptHash.email });
});

it('configures access tokens to expire in one hour', async () => {
  const module = await Test.createTestingModule({ imports: [AuthModule] })
    .overrideProvider(UsersService).useValue(users)
    .compile();
  expect(module.get(JWT_MODULE_OPTIONS).signOptions).toMatchObject({ expiresIn: '1h' });
});

it('rejects an unknown email or bad password with UnauthorizedException', async () => {
  users.findByEmail.mockResolvedValue(null);
  await expect(service.login('missing@example.com', 'password123')).rejects.toThrow(UnauthorizedException);

  users.findByEmail.mockResolvedValue(userWithScryptHash);
  await expect(service.login(userWithScryptHash.email, 'wrong-password')).rejects.toThrow(UnauthorizedException);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/auth/auth.service.spec.ts`
Expected: FAIL because auth methods and dependencies do not exist.

- [ ] **Step 3: Implement registration and login**

Configure the JWT module in `AuthModule`:

```ts
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.getOrThrow<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1h' },
  }),
})
```

In `AuthService`, use `v7()` from `uuid`, `randomBytes`, promisified `scrypt`, and `timingSafeEqual`. Store the salt with the derived key as `salt:hash` and compare equal-length buffers. Register checks for an existing e-mail and throws `ConflictException`; login throws `UnauthorizedException` for either absent users or mismatched passwords. Sign `{ sub: user.id, email: user.email }` with `JwtService.signAsync`.

- [ ] **Step 4: Run the focused auth test**

Run: `npm test -- src/auth/auth.service.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/auth
git commit -m "feat: add JWT registration and login"
```

### Task 4: Expose validated authentication endpoints

**Files:**
- Create: `src/auth/dto/register.dto.ts`
- Create: `src/auth/dto/login.dto.ts`
- Modify: `src/auth/auth.controller.ts`
- Modify: `src/auth/auth.controller.spec.ts`

**Interfaces:**
- Consumes: `AuthService.register(name, email, password)` and `AuthService.login(email, password)` from Task 3.
- Produces: `POST /auth/register` and `POST /auth/login`.

- [ ] **Step 1: Write failing controller delegation tests**

Mock `AuthService` and test the controller methods:

```ts
it('delegates registration to AuthService', async () => {
  auth.register.mockResolvedValue(publicUser);
  await expect(controller.register(registerDto)).resolves.toBe(publicUser);
  expect(auth.register).toHaveBeenCalledWith(registerDto.name, registerDto.email, registerDto.password);
});

it('delegates login to AuthService', async () => {
  auth.login.mockResolvedValue({ accessToken: 'token' });
  await expect(controller.login(loginDto)).resolves.toEqual({ accessToken: 'token' });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/auth/auth.controller.spec.ts`
Expected: FAIL because `register` and `login` controller methods do not exist.

- [ ] **Step 3: Add DTOs and controller routes**

Implement DTO decorators:

```ts
export class RegisterDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

Add `@Post('register')` and `@Post('login')` methods that accept `@Body()` DTOs and delegate to the service.

- [ ] **Step 4: Run the focused controller test**

Run: `npm test -- src/auth/auth.controller.spec.ts`
Expected: PASS.

- [ ] **Step 5: Run the complete verification suite**

Run: `npm run lint && npm test && npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/auth
git commit -m "feat: expose auth endpoints"
```

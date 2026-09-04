# User JWT Authentication Design

## Scope

Implement password-based registration and login in the existing `users` and
`auth` NestJS modules. Login returns a JWT that expires after one hour.

## User

`User` is a TypeORM entity with a UUIDv7 primary key, name, unique email, and
password hash. The password hash is not included in API responses.

## Endpoints

- `POST /auth/register` accepts name, email, and password. It validates the
  input, rejects duplicate emails with `409 Conflict`, stores the password with
  `crypto.scrypt`, and returns the created user without its password hash.
- `POST /auth/login` accepts email and password. Invalid credentials return
  `401 Unauthorized`; valid credentials return an `accessToken` signed with
  `JWT_SECRET` and a fixed one-hour expiration.

## Modules

`UsersModule` registers the entity repository and exports `UsersService`.
`AuthModule` imports `UsersModule` and configures Nest's JWT module from
`JWT_SECRET`. It owns registration, credential verification, and token
issuance.

## Validation and Tests

DTO validation ensures a non-empty name, valid email, and password before the
services run. Unit tests cover successful registration, duplicate email,
successful login, and rejected credentials. JWT configuration is asserted to
use a one-hour expiration.

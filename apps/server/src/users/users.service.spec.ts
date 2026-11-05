import { UsersService } from './users.service.js';
import { User } from './user.entity.js';

describe('UsersService', () => {
  const repository = {
    create: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
  };
  const service = new UsersService(repository as never);
  const user: User = {
    id: '018f7b6d-54cc-7000-8000-000000000001',
    name: 'Ana',
    email: 'ana@example.com',
    passwordHash: 'salt:hash',
    role: 'teacher',
    isActive: true,
    points: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('finds a user by email', async () => {
    repository.findOneBy.mockResolvedValue(user);

    await expect(service.findByEmail(user.email)).resolves.toBe(user);
    expect(repository.findOneBy).toHaveBeenCalledWith({ email: user.email });
  });

  it('creates and saves a user', async () => {
    repository.create.mockReturnValue(user);
    repository.save.mockResolvedValue(user);

    await expect(service.create(user)).resolves.toBe(user);
    expect(repository.create).toHaveBeenCalledWith(user);
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('lists all users', async () => {
    repository.find.mockResolvedValue([user]);

    await expect((service as any).findAll()).resolves.toEqual([user]);
  });

  it('deactivates an existing user', async () => {
    repository.findOneBy.mockResolvedValue({ ...user, isActive: false });

    await expect((service as any).deactivate(user.id)).resolves.toMatchObject({
      id: user.id,
      isActive: false,
    });
  });

  it('updates only the requested fields without overwriting points earned concurrently', async () => {
    repository.findOneBy.mockResolvedValueOnce(user)
      .mockResolvedValueOnce({ ...user, name: 'Ana Silva', points: 10 });

    await expect(service.update(user.id, { name: 'Ana Silva' })).resolves.toMatchObject({ name: 'Ana Silva', points: 10 });
    expect(repository.update).toHaveBeenCalledWith(user.id, { name: 'Ana Silva' });
    expect(repository.save).not.toHaveBeenCalled();
  });
});

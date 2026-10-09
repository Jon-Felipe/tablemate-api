import { User, UserRole } from './entities/user.entity.js';
import { UsersRepository } from './users.repository.js';

describe('UsersRepository', () => {
  let repository: UsersRepository;

  beforeEach(() => {
    repository = new UsersRepository();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return all users', () => {
    const result = repository.findAll();

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'user-1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
        }),
      ]),
    );
  });

  it('should return a user by id', () => {
    const result = repository.findById('user-1');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
      }),
    );
  });

  it('should return a user when the email exists', () => {
    const result = repository.findByEmail('alice@example.com');

    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-1',
        email: 'alice@example.com',
      }),
    );
  });

  it('should return undefined when the email does not exist', () => {
    const result = repository.findByEmail('unknown@example.com');

    expect(result).toBeUndefined();
  });

  it('should find a user when the email has different casing', () => {
    const result = repository.findByEmail('Alice@Example.com');
    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-1',
        email: 'alice@example.com',
      }),
    );
  });

  it('should find a user when the email is uppercase', () => {
    const result = repository.findByEmail('ALICE@EXAMPLE.COM');
    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-1',
        email: 'alice@example.com',
      }),
    );
  });

  it('should find a user when the email is has surrounding whitespace', () => {
    const result = repository.findByEmail(' alice@example.com ');
    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-1',
        email: 'alice@example.com',
      }),
    );
  });

  it('should return undefined when a user does not exist', () => {
    const result = repository.findById('does-not-exist');

    expect(result).toBeUndefined();
  });

  it('should create a user', () => {
    const user: User = {
      id: 'user-4',
      name: 'David Jones',
      email: 'david@example.com',
      passwordHash: 'hashed-password-4',
      role: UserRole.CUSTOMER,
    };

    const result = repository.create(user);
    expect(result).toEqual(user);
    expect(repository.findById('user-4')).toEqual(user);
  });
});

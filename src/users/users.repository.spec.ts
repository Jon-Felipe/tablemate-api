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

  it('should return undefined when a user does not exist', () => {
    const result = repository.findById('does-not-exist');

    expect(result).toBeUndefined();
  });
});

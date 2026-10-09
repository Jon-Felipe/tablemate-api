import { PasswordHashingService } from './password-hashing.service.js';

describe('PasswordHashingService', () => {
  let service: PasswordHashingService;

  beforeEach(() => {
    service = new PasswordHashingService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a hash different from the original password', async () => {
    const password = 'mySecretPassword123';
    const passwordHash = await service.hash(password);

    expect(passwordHash).not.toBe(password);
  });

  it('should produce a hash that Argon2 can verify', async () => {
    const argon2 = await import('argon2');
    const password = 'mySecretPassword123';
    const passwordHash = await service.hash(password);

    await expect(argon2.verify(passwordHash, password)).resolves.toBe(true);
  });

  it('should produce different hashes for the same password', async () => {
    const password = 'mySecretPassword123';
    const firstHash = await service.hash(password);
    const secondHash = await service.hash(password);

    expect(firstHash).not.toBe(secondHash);
  });
});

import { INestApplication } from '@nestjs/common';
import { createE2EApp } from '../helpers/e2e-setup.js';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';

describe('Authentication - Login (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    ({ app } = await createE2EApp());
  });

  afterEach(async () => {
    await app?.close();
  });

  it('should log in a registered user without exposing the password hash', async () => {
    const password = 'aSecurePassword123';

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Login Test User',
        email: 'login-test@example.com',
        password,
      })
      .expect(201);

    return request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'login-test@example.com',
        password,
      })
      .expect(async (response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.data).toEqual(
          expect.objectContaining({
            user: {
              id: expect.any(String),
              name: 'Login Test User',
              email: 'login-test@example.com',
              role: 'CUSTOMER',
            },
            accessToken: expect.any(String),
          }),
        );
        expect(response.body.data.user).not.toHaveProperty('passwordHash');

        const jwtService = app.get(JwtService);

        const payload = await jwtService.verifyAsync<{
          sub: string;
          role: string;
          iat: number;
          exp: number;
        }>(response.body.data.accessToken);

        expect(payload.sub).toBe(response.body.data.user.id);
        expect(payload.role).toBe('CUSTOMER');
        expect(payload.iat).toBeDefined();
        expect(payload.exp).toBeDefined();
        expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
      });
  });

  it('should reject an invalid email', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'not-an-email',
        password: 'aSecurePassword123',
      })
      .expect(400);
  });

  it('should reject missing credentials', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({})
      .expect(400);
  });

  it('should reject an empty password', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'alice@example.com',
        password: '',
      })
      .expect(400);
  });

  it('should reject an unknown email', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'unknown@example.com',
        password: 'aSecurePassword123',
      })
      .expect(401)
      .expect((response) => {
        expect(response.body.message).toBe('Invalid email or password');
      });
  });

  it('should reject an incorrect password', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Wrong Password User',
        email: 'wrong-password@example.com',
        password: 'aSecurePassword123',
      })
      .expect(201);

    return request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'wrong-password@example.com',
        password: 'aDifferentPassword123',
      })
      .expect(401)
      .expect((response) => {
        expect(response.body.message).toBe('Invalid email or password');
      });
  });
});

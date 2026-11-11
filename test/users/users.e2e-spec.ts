import { INestApplication } from '@nestjs/common';
import { createE2EApp } from '../helpers/e2e-setup.js';
import request from 'supertest';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    ({ app } = await createE2EApp());
  });

  afterEach(async () => {
    await app?.close();
  });

  it('should return all users without password hashes', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(200)
      .expect((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe('Users retrieved successfully');
        expect(response.body.data).toHaveLength(3);
        response.body.data.forEach((user: Record<string, unknown>) => {
          expect(user.passwordHash).toBeUndefined();
        });
      });
  });

  it('should return the current user without a password hash', async () => {
    const password = 'aSecurePassword123';

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Current Test User',
        email: 'current-user-test@example.com',
        password,
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'current-user-test@example.com',
        password,
      })
      .expect(200);

    const accessToken = loginResponse.body.data.accessToken as string;
    const userId = loginResponse.body.data.user.id as string;

    await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe(
          'Current user retrieved successfully',
        );
        expect(response.body.data).toEqual({
          id: userId,
          name: 'Current Test User',
          email: 'current-user-test@example.com',
          role: 'CUSTOMER',
        });
        expect(response.body.data).not.toHaveProperty('passwordHash');
      });
  });

  it('should return 401 without an access token', () => {
    return request(app.getHttpServer()).get('/api/v1/users/me').expect(401);
  });

  it('should return 401 with an invalid access token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('should return a user with a valid access token', async () => {
    const password = 'aSecurePassword123';

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Authenticated Test User',
        email: 'authenticated-test@example.com',
        password,
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'authenticated-test@example.com',
        password,
      })
      .expect(200);

    const accessToken = loginResponse.body.data.accessToken as string;

    await request(app.getHttpServer())
      .get(`/api/v1/users/${loginResponse.body.data.user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe('User retrieved successfully');
        expect(response.body.data).toEqual(
          expect.objectContaining({
            name: 'Authenticated Test User',
            email: 'authenticated-test@example.com',
            role: 'CUSTOMER',
          }),
        );
        expect(response.body.data.passwordHash).toBeUndefined();
      });
  });

  it('should return 404 for a missing user', async () => {
    const password = 'aSecurePassword123';

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Authenticated Test User',
        email: 'missing=user-test@example.com',
        password,
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({
        email: 'missing=user-test@example.com',
        password,
      })
      .expect(200);

    const accessToken = loginResponse.body.data.accessToken as string;

    return request(app.getHttpServer())
      .get('/api/v1/users/does-not-exist')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('should return 401 without an access token', () => {
    return request(app.getHttpServer()).get('/api/v1/users/user-1').expect(401);
  });
});

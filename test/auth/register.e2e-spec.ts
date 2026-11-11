import { INestApplication } from '@nestjs/common';
import { createE2EApp } from '../helpers/e2e-setup.js';
import request from 'supertest';

describe('Authentication - Registration (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    ({ app } = await createE2EApp());
  });

  afterEach(async () => {
    await app?.close();
  });

  it('should create a user', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'David Jones',
        email: 'david@example.com',
        password: 'aSecurePassword123',
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.statusCode).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.data).toEqual(
          expect.objectContaining({
            name: 'David Jones',
            email: 'david@example.com',
            role: 'CUSTOMER',
          }),
        );
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.passwordHash).toBeUndefined();
      });
  });

  it('should assign CUSTOMER when the client supplies ADMIN role', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'David Jones',
        email: 'david@example.com',
        password: 'aSecurePassword123',
        role: 'ADMIN',
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.statusCode).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.data.role).toBe('CUSTOMER');
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.passwordHash).toBeUndefined();
      });
  });

  it('should reject an invalid email', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Alice',
        email: 'not-an-email',
        password: 'aSecurePassword123',
      })
      .expect(400);
  });

  it('should reject a duplicate email', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Another Alice',
        email: 'alice@example.com',
        password: 'aSecurePassword123',
      })
      .expect(409)
      .expect((response) => {
        expect(response.body.statusCode).toBe(409);
        expect(response.body.message).toBe('Email is already registered');
      });
  });

  it('should reject an email with different casing', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Another Alice',
        email: 'Alice@Example.com',
        password: 'aSecurePassword123',
      })
      .expect(409)
      .expect((response) => {
        expect(response.body.statusCode).toBe(409);
        expect(response.body.message).toBe('Email is already registered');
      });
  });

  it('should reject a password shorter than 12 characters', () => {
    return request(app.getHttpServer())
      .post('/api/v1/users')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret123',
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toContain(
          'password must be longer than or equal to 12 characters',
        );
      });
  });
});

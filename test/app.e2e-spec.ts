import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/restaurants should return all restaurants', () => {
    return request(app.getHttpServer())
      .get('/api/v1/restaurants')
      .expect(200)
      .expect((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe(
          'Restaurants retrieved successfully',
        );
        expect(response.body.data).toHaveLength(3);
      });
  });

  it('POST /api/v1/restaurants should reject an invalid restaurant', () => {
    return request(app.getHttpServer())
      .post('/api/v1/restaurants')
      .send({
        name: '',
        description: 'Authentic Italian cuisine',
        cuisine: 'Italian',
        address: '10 Church Street',
        city: 'Cape Town',
      })
      .expect(400);
  });

  it('POST /api/v1/restaurants should create a restaurant', () => {
    return request(app.getHttpServer())
      .post('/api/v1/restaurants')
      .send({
        name: 'La Piazza',
        description: 'Authentic Italian cuisine',
        cuisine: 'Italian',
        address: '10 Church Street',
        city: 'Cape Town',
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.statusCode).toBe(201);
        expect(response.body.message).toBe('Restaurant created successfully');
        expect(response.body.data).toEqual(
          expect.objectContaining({
            name: 'La Piazza',
            description: 'Authentic Italian cuisine',
            cuisine: 'Italian',
            address: '10 Church Street',
            city: 'Cape Town',
          }),
        );
        expect(response.body.data.id).toBeDefined();
      });
  });

  it('GET /api/v1/restaurants/:id should return a restaurant', () => {
    return request(app.getHttpServer())
      .get('/api/v1/restaurants/restaurant-1')
      .expect(200)
      .expect((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe('Restaurant retrieved successfully');
        expect(response.body.data).toEqual(
          expect.objectContaining({
            id: 'restaurant-1',
            name: 'The Golden Fork',
          }),
        );
      });
  });

  it('GET /api/v1/restaurants/:id should return 404 for a missing restaurant', () => {
    return request(app.getHttpServer())
      .get('/api/v1/restaurants/does-not-exist')
      .expect(404);
  });

  it('PATCH /api/v1/restaurants/:id should update a restaurant', () => {
    return request(app.getHttpServer())
      .patch('/api/v1/restaurants/restaurant-1')
      .send({
        name: 'The Golden Fork Updated',
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe('Restaurant updated successfully');
        expect(response.body.data).toEqual(
          expect.objectContaining({
            id: 'restaurant-1',
            name: 'The Golden Fork Updated',
            description: 'Modern European cuisine in a relaxed atmosphere.',
            cuisine: 'European',
          }),
        );
      });
  });

  it('PATCH /api/v1/restaurants/:id should return 404 for a missing restaurant', () => {
    return request(app.getHttpServer())
      .patch('/api/v1/restaurants/does-not-exist')
      .send({
        name: 'Updated Name',
      })
      .expect(404);
  });

  it('DELETE /api/v1/restaurants/:id should remove a restaurant', async () => {
    await request(app.getHttpServer())
      .delete('/api/v1/restaurants/restaurant-1')
      .expect(204);

    await request(app.getHttpServer())
      .get('/api/v1/restaurants/restaurant-1')
      .expect(404);
  });

  it('DELETE /api/v1/restaurants/:id should return 404 for a missing restaurant', () => {
    return request(app.getHttpServer())
      .delete('/api/v1/restaurants/does-not-exist')
      .expect(404);
  });

  it('GET /api/v1/users should return all users', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users')
      .expect(200)
      .expect((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe('Users retrieved successfully');
        expect(response.body.data).toHaveLength(3);
      });
  });

  it('GET /api/v1/users/:id should return a user', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users/user-1')
      .expect(200)
      .expect((response) => {
        expect(response.body.statusCode).toBe(200);
        expect(response.body.message).toBe('User retrieved successfully');
        expect(response.body.data).toEqual(
          expect.objectContaining({
            id: 'user-1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'CUSTOMER',
          }),
        );
      });
  });

  it('GET /api/v1/users/:id should return 404 for a missing user', () => {
    return request(app.getHttpServer())
      .get('/api/v1/users/does-not-exist')
      .expect(404);
  });
});

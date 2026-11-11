import { INestApplication } from '@nestjs/common';
import { createE2EApp } from '../helpers/e2e-setup.js';
import request from 'supertest';

describe('Restaurants (e2e)', () => {
  let app: INestApplication;
  let adminAccessToken: string;
  let staffAccessToken: string;
  let anotherStaffAccessToken: string;
  let customerAccessToken: string;

  const restaurantPayload = {
    name: 'Test Restaurant',
    imageUrl: 'https://example.com/image.jpg',
    description: 'A test restaurant',
    cuisine: 'Italian',
    address: '123 Test St',
    city: 'Test City',
  };

  beforeEach(async () => {
    ({
      app,
      adminAccessToken,
      staffAccessToken,
      anotherStaffAccessToken,
      customerAccessToken,
    } = await createE2EApp());
  });

  afterEach(async () => {
    await app?.close();
  });

  describe('GET /restaurants', () => {
    it('should return all restaurants', () => {
      return request(app.getHttpServer())
        .get('/api/v1/restaurants')
        .expect(200)
        .expect((response) => {
          expect(response.body.statusCode).toBe(200);
          expect(response.body.message).toBe(
            'Restaurants retrieved successfully',
          );
          expect(response.body.data).toHaveLength(10);
        });
    });
  });

  describe('POST /restaurants', () => {
    it('should reject an invalid restaurant', () => {
      return request(app.getHttpServer())
        .post('/api/v1/restaurants')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...restaurantPayload,
          name: '',
        })
        .expect(400);
    });

    it('should return 401 without a token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/restaurants')
        .send(restaurantPayload)
        .expect(401);
    });

    it('should return 403 for a customer', () => {
      return request(app.getHttpServer())
        .post('/api/v1/restaurants')
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(restaurantPayload)
        .expect(403);
    });

    it('should create a restaurant', () => {
      return request(app.getHttpServer())
        .post('/api/v1/restaurants')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(restaurantPayload)
        .expect(201)
        .expect((response) => {
          expect(response.body.statusCode).toBe(201);
          expect(response.body.message).toBe('Restaurant created successfully');
          expect(response.body.data).toEqual(
            expect.objectContaining({
              name: 'Test Restaurant',
              ownerId: 'e2e-admin-1',
              description: 'A test restaurant',
              cuisine: 'Italian',
              address: '123 Test St',
              city: 'Test City',
            }),
          );
          expect(response.body.data.id).toBeDefined();
        });
    });
  });

  describe('GET /restaurants/:id', () => {
    it('should return a restaurant', () => {
      return request(app.getHttpServer())
        .get('/api/v1/restaurants/restaurant-1')
        .expect(200)
        .expect((response) => {
          expect(response.body.statusCode).toBe(200);
          expect(response.body.message).toBe(
            'Restaurant retrieved successfully',
          );
          expect(response.body.data).toEqual(
            expect.objectContaining({
              id: 'restaurant-1',
              name: 'The Golden Fork',
            }),
          );
        });
    });

    it('should return 404 for a missing restaurant', () => {
      return request(app.getHttpServer())
        .get('/api/v1/restaurants/does-not-exist')
        .expect(404);
    });
  });

  describe('PATCH /restaurants/:id', () => {
    it('should return 401 without a token', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/restaurants/restaurant-1')
        .send({
          name: 'Updated Name',
        })
        .expect(401);
    });

    it('should return 403 for a customer', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/restaurants/restaurant-1')
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send({
          name: 'Updated Name',
        })
        .expect(403);
    });

    it('should update a restaurant as admin', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/restaurants/restaurant-1')
        .set('Authorization', `Bearer ${adminAccessToken}`)
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
              imageUrl:
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
              description: 'Modern European cuisine in a relaxed atmosphere.',
              cuisine: 'European',
            }),
          );
        });
    });

    it('should allow staff to update their own restaurant', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/restaurants/restaurant-1')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({
          name: 'Staff Updated Restaurant',
        })
        .expect(200);
    });

    it('should allow admin to update another staff members restaurant', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/restaurants/restaurant-1')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: 'Admin Updated Restaurant',
        })
        .expect(200);
    });

    it('should forbid staff from updating another staff members restaurant', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/restaurants/restaurant-1')
        .set('Authorization', `Bearer ${anotherStaffAccessToken}`)
        .send({
          name: 'Unauthorized Update',
        })
        .expect(403);
    });

    it('should return 404 for a missing restaurant', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/restaurants/does-not-exist')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: 'Updated Name',
        })
        .expect(404);
    });
  });

  describe('DELETE restaurants/:id', () => {
    it('should return 401 without a token', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/restaurants/restaurant-1')
        .expect(401);
    });

    it('should return 403 for a customer', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/restaurants/restaurant-1')
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .expect(403);
    });

    it('should remove a restaurant', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/restaurants/restaurant-1')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(204);

      await request(app.getHttpServer())
        .get('/api/v1/restaurants/restaurant-1')
        .expect(404);
    });

    it('should allow staff to remove their own restaurant', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/restaurants/restaurant-1')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(204);
    });

    it('should forbid staff from removing another staff members restaurant', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/restaurants/restaurant-2')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(403);
    });

    it('should return 404 for a missing restaurant', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/restaurants/does-not-exist')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { createE2EApp } from '../helpers/e2e-setup.js';
import request from 'supertest';

describe('Restaurant Menus (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    ({ app } = await createE2EApp());
  });

  afterEach(async () => {
    await app?.close();
  });

  describe('GET /restaurants/:id/menus', () => {
    it('should return a restaurant menu', () => {
      return request(app.getHttpServer())
        .get('/api/v1/restaurants/restaurant-1/menu')
        .expect(200)
        .expect((response) => {
          expect(response.body.statusCode).toBe(200);
          expect(response.body.message).toBe(
            'Restaurant menu retrieved successfully',
          );
          expect(response.body.data).toEqual(
            expect.objectContaining({
              restaurantId: 'restaurant-1',
              categories: expect.any(Array),
            }),
          );
        });
    });

    it('should return 404 for a missing restaurant', () => {
      return request(app.getHttpServer())
        .get('/api/v1/restaurants/does-not-exist/menu')
        .expect(404);
    });
  });
});

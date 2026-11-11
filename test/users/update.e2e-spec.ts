import { INestApplication } from '@nestjs/common';
import { createE2EApp } from '../helpers/e2e-setup.js';
import request from 'supertest';

describe('Authentication - Update (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    ({ app } = await createE2EApp());
  });

  afterEach(async () => {
    await app?.close();
  });

  it('should update the user successfully', async () => {
    const password = 'aSecurePassword123';

    await request(app.getHttpServer())
      .post('/api/v1/users')
      .send({ name: 'Test User', email: 'test@example.com', password })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/users/login')
      .send({ email: 'test@example.com', password })
      .expect(200);

    const accessToken = loginResponse.body.data.accessToken as string;
    const userId = loginResponse.body.data.user.id as string;

    const updateData = {
      name: 'Updated Name',
    };

    await request(app.getHttpServer())
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateData)
      .expect(200)
      .expect((response) => {
        expect(response.body.data.id).toBe(userId);
        expect(response.body.data.name).toBe(updateData.name);
      });
  });
});

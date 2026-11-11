import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

// extras
import { AppModule } from '../../src/app.module.js';

export interface E2ETestContext {
  app: INestApplication;
  adminAccessToken: string;
  staffAccessToken: string;
  anotherStaffAccessToken: string;
  customerAccessToken: string;
}

export async function createE2EApp(): Promise<E2ETestContext> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();

  const jwtService = app.get(JwtService);

  const [
    adminAccessToken,
    staffAccessToken,
    anotherStaffAccessToken,
    customerAccessToken,
  ] = await Promise.all([
    jwtService.signAsync({ sub: 'e2e-admin-1', role: 'ADMIN' }),
    jwtService.signAsync({ sub: 'user-2', role: 'STAFF' }),
    jwtService.signAsync({ sub: 'another-staff-1', role: 'STAFF' }),
    jwtService.signAsync({ sub: 'e2e-customer-1', role: 'CUSTOMER' }),
  ]);

  return {
    app,
    adminAccessToken,
    staffAccessToken,
    anotherStaffAccessToken,
    customerAccessToken,
  };
}

import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { setupE2EApp } from './test-helper';

describe('CourierController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/couriers (GET) - should list available couriers', async () => {
    const res = await request(app.getHttpServer())
      .get('/couriers')
      .expect(200);
    
    expect(Array.isArray(res.body)).toBe(true);
  });

});

import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { setupE2EApp } from './test-helper';

describe('CouponController (e2e)', () => {
  let app: INestApplication;
  let createdCouponId: number;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/coupons (POST) - should create a coupon for restaurant 1', async () => {
    const res = await request(app.getHttpServer())
      .post('/coupons')
      .send({
        restaurantId: 1,
        code: 'E2E10',
        type: 'percent',
        value: '10',
        min: 30,
        limit: 100,
        isActive: true,
        expiresAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      })
      .expect(201);
    
    expect(res.body).toHaveProperty('id');
    expect(res.body.message).toBe('Coupon created successfully');
    createdCouponId = res.body.id;
  });

  it('/coupons (GET) - should list coupons for restaurant 1', async () => {
    const res = await request(app.getHttpServer())
      .get('/coupons?restaurantId=1')
      .expect(200);
    
    expect(Array.isArray(res.body)).toBe(true);
    const coupon = res.body.find((c: any) => c.id === createdCouponId);
    expect(coupon).toBeDefined();
    expect(coupon.code).toBe('E2E10');
    expect(coupon.value).toBe('10');
  });

});

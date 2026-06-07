import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { setupE2EApp } from './test-helper';

describe('PaymentsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/payments/checkout (POST) - should initiate checkout for an order', async () => {
    // We create a mock order first
    const orderRes = await request(app.getHttpServer())
      .post('/orders')
      .send({
        restaurantId: 1,
        deliveryAddressId: 1,
        items: [
          {
            productId: 1,
            name: 'Pizza E2E',
            price: 49.90,
            quantity: 1,
          }
        ]
      });

    const orderId = orderRes.body.id;

    // Now test the checkout flow
    // As we see from logs: "Pagamentos rodarão em MODO SIMULADO (Mock)!"
    // The payment will be created locally.
    const res = await request(app.getHttpServer())
      .post('/payments/checkout')
      .send({
        orderId: orderId,
        paymentMethod: 'pix',
      })
      .expect(201);
    
    expect(res.body).toHaveProperty('transactionId');
    expect(res.body).toHaveProperty('paymentUrl');
    expect(res.body).toHaveProperty('qrCode');
    expect(res.body.status).toBe('PENDING');
  });
});

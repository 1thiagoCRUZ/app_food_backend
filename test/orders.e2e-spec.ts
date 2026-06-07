import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { setupE2EApp } from './test-helper';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let createdOrderId: number;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/orders (POST) - should create an order for restaurant 1', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({
        restaurantId: 1,
        deliveryAddressId: 1,
        items: [
          {
            productId: 1,
            name: 'Pizza E2E',
            price: 49.90,
            quantity: 2
          }
        ]
      })
      .expect(201);
    
    expect(res.body).toHaveProperty('id');
    expect(res.body.message).toBe('Pedido criado com sucesso');
    createdOrderId = res.body.id;
  });

  it('/orders/restaurant/:id (GET) - should list orders for restaurant 1', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders/restaurant/1')
      .expect(200);
    
    expect(Array.isArray(res.body)).toBe(true);
    const order = res.body.find((o: any) => o.id === createdOrderId);
    expect(order).toBeDefined();
    expect(order.items.length).toBeGreaterThan(0);
    expect(order.items[0].name).toBe('Pizza E2E');
  });

});

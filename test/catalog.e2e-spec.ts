import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { setupE2EApp } from './test-helper';

describe('CatalogController (e2e)', () => {
  let app: INestApplication;
  let createdProductId: number;

  beforeAll(async () => {
    app = await setupE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (POST) - should create a product for restaurant 1', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({
        restaurantId: 1,
        name: 'Pizza E2E',
        description: 'Pizza created from e2e tests',
        price: 49.90,
        available: true,
      })
      .expect(201);
    
    expect(res.body).toHaveProperty('id');
    expect(res.body.message).toBe('Produto criado com sucesso');
    createdProductId = res.body.id;
  });

  it('/products (GET) - should list products for restaurant 1', async () => {
    const res = await request(app.getHttpServer())
      .get('/products?restaurantId=1')
      .expect(200);
    
    expect(Array.isArray(res.body)).toBe(true);
    const product = res.body.find((p: any) => p.id === createdProductId);
    expect(product).toBeDefined();
    expect(product.name).toBe('Pizza E2E');
  });

  it('/products/:id (PUT) - should update the created product', async () => {
    const res = await request(app.getHttpServer())
      .put(`/products/${createdProductId}`)
      .send({
        price: 59.90,
      })
      .expect(200);

    expect(res.body.message).toBe('Produto atualizado com sucesso');

    // Verify update
    const getRes = await request(app.getHttpServer()).get('/products?restaurantId=1');
    const product = getRes.body.find((p: any) => p.id === createdProductId);
    expect(product.price).toBe('59.90'); // decimal from DB comes as string usually
  });

  it('/products/:id (DELETE) - should delete the product', async () => {
    // Create a temporary product just to test the delete functionality
    const tempProduct = await request(app.getHttpServer())
      .post('/products')
      .send({
        restaurantId: 1,
        name: 'Pizza To Delete',
        description: 'Temporary',
        price: 10.0,
        available: false,
      });
      
    const idToDelete = tempProduct.body.id;

    await request(app.getHttpServer())
      .delete(`/products/${idToDelete}`)
      .expect(204);

    // Verify deletion
    const getRes = await request(app.getHttpServer()).get('/products?restaurantId=1');
    const product = getRes.body.find((p: any) => p.id === idToDelete);
    expect(product).toBeUndefined();
  });
});

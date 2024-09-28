import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

describe('ProductController', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    httpServer = app.getHttpServer();
  });

  afterEach(async () => dataSource
        .createQueryBuilder()
        .delete()
        .from('products')
        .execute());

  afterAll(async () => {
    await app.close();
  });

  describe('POST /products', () => {
    it('returns 200 and the recently created product upon successful request', async () => {
      let productId;

      const productFixture = {
        name: "bottle",
        description: "great bottle",
        category: "things",
        price: 2.5,
        stock: 10
      };

      await request(httpServer)
        .post('/products')
        .send(productFixture)
        .expect(201)
        .expect((res) => {
          productId = res.body.data.id;
          expect(typeof res.body.data.id).toBe('number');
          expect(res.body.data.id).toBeGreaterThan(0);
          expect(res.body.data.name).toBe(productFixture.name);
          expect(res.body.data.description).toBe(productFixture.description);
          expect(res.body.data.category).toBe(productFixture.category);
          expect(parseFloat(res.body.data.price)).toBe(productFixture.price);
          expect(parseInt(res.body.data.stock)).toBe(productFixture.stock);
          expect(res.body.data.createdAt).toBe(res.body.data.updatedAt);
        });

      const product = await dataSource
        .createQueryBuilder()
        .select('*')
        .from('products', 'p')
        .where('p.id = :id', { id: productId })
        .getRawOne();
      
      expect(product.id).toBe(productId.toString());
      expect(product.name).toBe(productFixture.name);
      expect(product.description).toBe(productFixture.description);
      expect(product.category).toBe(productFixture.category);
      expect(parseFloat(product.price)).toBe(productFixture.price);
      expect(parseInt(product.stock)).toBe(productFixture.stock);
      expect(product.created_at.toISOString()).toBe(product.updated_at.toISOString());
    });
  });

  it('returns 400 if any of the attributes in the request body are missing', async () => {
    await request(httpServer)
      .post('/products')
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          "message": [
            {
              "target": {},
              "property": "name",
              "children": [],
              "constraints": {
                "isString": "name must be a string"
              }
            },
            {
              "target": {},
              "property": "description",
              "children": [],
              "constraints": {
                "isString": "description must be a string"
              }
            },
            {
              "target": {},
              "property": "category",
              "children": [],
              "constraints": {
                "isString": "category must be a string"
              }
            },
            {
              "target": {},
              "property": "price",
              "children": [],
              "constraints": {
                "isNumber": "price must be a number conforming to the specified constraints",
                "isPositive": "price must be a positive number",
              }
            },
            {
              "target": {},
              "property": "stock",
              "children": [],
              "constraints": {
                "isInt": "stock must be an integer number",
                "min": "stock must not be less than 0",
              }
            }
          ],
          "error": "Bad Request",
          "statusCode": 400
        })
      });
  });

  it('returns 400 the price has more than two decimal plates', async () => {
    const productFixture = {
      name: "bottle",
      description: "great bottle",
      category: "things",
      price: 2.555,
      stock: 3
    };

    await request(httpServer)
      .post('/products')
      .send(productFixture)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          "message": [
            {
              "target": {
                "name": "bottle",
                "description": "great bottle",
                "category": "things",
                "price": 2.555,
                "stock": 3
              },
              "value": 2.555,
              "property": "price",
              "children": [],
              "constraints": {
                "isNumber": "price must be a number conforming to the specified constraints"
              }
            }
          ],
          "error": "Bad Request",
          "statusCode": 400
        })
      });
  });
});

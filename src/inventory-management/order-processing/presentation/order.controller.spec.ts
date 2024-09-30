import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { DataSource } from 'typeorm';
import { insertIntoProducts, productsFixture } from '../../../commons/fixtures/product.fixture';

describe('OrderController', () => {
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

  describe('POST /orders', () => {
    it('returns 400 if the items property is missing', async () => {
      await request(httpServer)
        .post('/orders')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            "message": [
              {
                "target": {},
                "property": "items",
                "children": [],
                "constraints": {
                  "isArray": "items must be an array"
                }
              }
            ],
            "error": "Bad Request",
            "statusCode": 400
          });
        });
    });

    it('returns 400 if an order item is invalid', async () => {
      await request(httpServer)
        .post('/orders')
        .send({ items: [{}] })
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            "message": [
              {
                "target": { "items": [{}] },
                "value": [{}],
                "property": "items",
                "children": [
                  {
                    "target": [{}],
                    "value": {},
                    "property": "0",
                    "children": [
                      {
                        "target": {},
                        "property": "productId",
                        "children": [],
                        "constraints": {
                          "min": "productId must not be less than 0",
                          "isInt": "productId must be an integer number"
                        }
                      },
                      {
                        "target": {},
                        "property": "quantity",
                        "children": [],
                        "constraints": {
                          "min": "quantity must not be less than 0",
                          "isInt": "quantity must be an integer number"
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            "error": "Bad Request",
            "statusCode": 400
          });
        });
    });

    it('returns 400 if the items property is an empty list', async () => {
      await request(httpServer)
      .post('/orders')
      .send({ items: [] })
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          "message": "An order must have at least one order item.",
          "error": "Bad Request",
          "statusCode": 400
        });
      });
    });

    it('returns 400 if any of the product ids are not unique', async () => {
      await request(httpServer)
      .post('/orders')
      .send({ items: [{ productId: 1, quantity: 1 }, { productId: 1, quantity: 1 }] })
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          "message": "Order items must be unique.",
          "error": "Bad Request",
          "statusCode": 400
        });
      });
    });

    it('returns 409 the stock count is insufficient', async () => {
      const results = (await insertIntoProducts(dataSource, productsFixture))
      .map(result => result.generatedMaps[0]);

      await request(httpServer)
      .post('/orders')
      .send({ items: [
        { productId: parseInt(results[0].id), quantity: 1 },
        { productId: parseInt(results[1].id), quantity: 11 }] })
      .expect(409)
      .expect((res) => {
        expect(res.body).toEqual({
          "message": "Some order items exeed the products stock count.",
          "order": {
            "items": [
              {
                "productId": parseInt(results[0].id),
                "quantity": 1,
              },
              {
                "productId": parseInt(results[1].id),
                "quantity": 11,
              },
            ],
          },
          "products": [{
            "category": "games",
            "createdAt": results[1].createdAt.toISOString(),
            "description": "d20",
            "id": parseInt(results[1].id),
            "name": "dice",
            "price": 2,
            "stock": 10,
            "updatedAt": results[1].updatedAt.toISOString(),
          }]
        });
      });
    });

    it('returns 200 if the order could be processed', async () => {
      const results = (await insertIntoProducts(dataSource, productsFixture))
      .map(result => result.generatedMaps[0]);

      await request(httpServer)
      .post('/orders')
      .send({ items: [
        { productId: parseInt(results[0].id), quantity: 1 },
        { productId: parseInt(results[1].id), quantity: 2 }] })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ message: 'Order processed sucessfully.' });
      });

      const product1 = await dataSource
        .createQueryBuilder()
        .select('*')
        .from('products', 'p')
        .where('p.id = :id', { id: results[0].id })
        .getRawOne();
      
      expect(parseInt(product1.stock)).toBe(9);

      const product2 = await dataSource
        .createQueryBuilder()
        .select('*')
        .from('products', 'p')
        .where('p.id = :id', { id: results[1].id })
        .getRawOne();
      
      expect(parseFloat(product2.stock)).toBe(8);
    });
  });
});

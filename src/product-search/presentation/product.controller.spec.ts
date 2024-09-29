import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { insertIntoProducts, productsFixture } from '../../commons/fixtures/product.fixture';

describe('SearchController', () => {
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

  describe('GET /products/search', () => {
    it('fails if page size exceeds maximum value', async () => {
      await request(httpServer)
        .get('/products/search?pageSize=1001')
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            "message": [
              {
                "target": {
                  "pageSize": 1001
                },
                "value": 1001,
                "property": "pageSize",
                "children": [],
                "constraints": {
                  "max": "PageSize must be less than 1000"
                }
              }
            ],
            "error": "Bad Request",
            "statusCode": 400
          });
        });
    });

    it('fails if pagination query parameters are incorrect', async () => {
      await request(httpServer)
        .get('/products/search?page=0&pageSize=0')
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            "message": [
              {
                "target": {
                  "page": 0,
                  "pageSize": 0
                },
                "value": 0,
                "property": "page",
                "children": [],
                "constraints": {
                  "min": "Page must be at least 1"
                }
              },
              {
                "target": {
                  "page": 0,
                  "pageSize": 0
                },
                "value": 0,
                "property": "pageSize",
                "children": [],
                "constraints": {
                  "min": "PageSize must be at least 1"
                }
              }
            ],
            "error": "Bad Request",
            "statusCode": 400
          });
        });
    });

    it('fails if search query parameters are incorrect', async () => {
      await request(httpServer)
        .get('/products/search?minPrice=-1&maxPrice=-1')
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            "message": [
              {
                "target": {
                  "minPrice": -1,
                  "maxPrice": -1
                },
                "value": -1,
                "property": "minPrice",
                "children": [],
                "constraints": {
                  "min": "minPrice must not be less than 0"
                }
              },
              {
                "target": {
                  "minPrice": -1,
                  "maxPrice": -1
                },
                "value": -1,
                "property": "maxPrice",
                "children": [],
                "constraints": {
                  "min": "maxPrice must not be less than 0"
                }
              }
            ],
            "error": "Bad Request",
            "statusCode": 400
          });
        });
    });

    it('presents products lexicographically', async () => {
      await insertIntoProducts(dataSource, productsFixture);
      await request(httpServer)
        .get('/products/search')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.map(product => product.name)).toEqual(
            ['apple', 'beer', 'carrot', 'dice', 'energy drink'])
        });
    });

    it('filters by maximum price', async () => {
      await insertIntoProducts(dataSource, productsFixture);
      await request(httpServer)
        .get('/products/search?maxPrice=3')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.map(product => product.name))
            .toEqual(['carrot', 'dice', 'energy drink']);
          expect(res.body.meta).toEqual({
            page: 1,
            perPage: 10,
            total: 3,
            totalPages: 1
          });
        });
    });

    it('filters by minimum price', async () => {
      await insertIntoProducts(dataSource, productsFixture);
      await request(httpServer)
        .get('/products/search?minPrice=3')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.map(product => product.name))
            .toEqual(['apple', 'beer', 'carrot']);
          expect(res.body.meta).toEqual({
            page: 1,
            perPage: 10,
            total: 3,
            totalPages: 1
          });
        });
    });

    it('filters by category', async () => {
      await insertIntoProducts(dataSource, productsFixture);
      await request(httpServer)
        .get('/products/search?category=drinks')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.map(product => product.name)).toEqual(['beer', 'energy drink']);
          expect(res.body.meta).toEqual({
            page: 1,
            perPage: 10,
            total: 2,
            totalPages: 1
          });
        });
    });

    it('filters products by names starting with the provided name prefix', async () => {
      await insertIntoProducts(dataSource, productsFixture);
      await request(httpServer)
        .get('/products/search?name=car')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.map(product => product.name)).toEqual(['carrot']);
          expect(res.body.meta).toEqual({
            page: 1,
            perPage: 10,
            total: 1,
            totalPages: 1
          });
        });
    });

    it('paginates the results', async () => {
      await insertIntoProducts(dataSource, productsFixture);
      await request(httpServer)
        .get('/products/search?page=2&pageSize=2')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.map(product => product.name)).toEqual(['carrot', 'dice']);
          expect(res.body.meta).toEqual({
            page: 2,
            perPage: 2,
            total: 5,
            totalPages: 3
          });
        });
    });

    it('returns 200 and the list of available products', async () => {
      const productFixture = {
        name: "bottle",
        description: "great bottle",
        category: "things",
        price: 2.5,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      let result = await dataSource
        .createQueryBuilder()
        .insert()
        .into('products')
        .values(productFixture)
        .returning('*')
        .execute();
      await request(httpServer)
        .get('/products/search')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            data: [{
              id: parseInt(result.raw[0].id),
              name: result.raw[0].name,
              description: result.raw[0].description,
              category: result.raw[0].category,
              price: parseFloat(result.raw[0].price),
              stock: parseInt(result.raw[0].stock),
            }],
            meta: {
              page: 1,
              perPage: 10,
              total: 1,
              totalPages: 1,
            }
          });
        });
    });
  });
});

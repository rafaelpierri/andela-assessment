import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { insertIntoProducts, productsFixture } from '../../commons/fixtures/product.fixture';

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

  describe('GET /products', () => {
    it('fails if page size exceeds maximum value', async () => {
      await request(httpServer)
      .get('/products?pageSize=1001')
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

    it('fails if query parameters are incorrect', async () => {
      await request(httpServer)
      .get('/products?page=0&pageSize=0')
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

    it('presents products lexicographically', async () => {
      await insertIntoProducts(dataSource, productsFixture);
      await request(httpServer)
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(res.body.data.map(product => product.name)).toEqual(
          ['apple', 'band-aid', 'carrot', 'dice', 'energy drink'])
      });
    });

    it('paginates the results', async () => {
      await insertIntoProducts(dataSource, productsFixture);
      await request(httpServer)
      .get('/products?page=2&pageSize=2')
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
      const productFixture = { ...productsFixture[0] };
      const [result] = await insertIntoProducts(dataSource, [productFixture]);

      await request(httpServer)
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          data: [{
            id: parseInt(result.raw[0].id),
            name: result.raw[0].name,
            description: result.raw[0].description,
            category: result.raw[0].category,
            price: parseFloat(result.raw[0].price),
            stock: result.raw[0].stock,
            createdAt: result.raw[0].created_at.toISOString(),
            updatedAt: result.raw[0].updated_at.toISOString(),
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

  describe('POST /products', () => {
    it('returns 200 and the recently created product upon successful request', async () => {
      let productId;

      const productFixture = { ...productsFixture[0] };
      delete productFixture.createdAt;
      delete productFixture.updatedAt;

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
      ...productsFixture[0],
      price: 2.555
    };
    delete productFixture.createdAt;
    delete productFixture.updatedAt;

    await request(httpServer)
      .post('/products')
      .send(productFixture)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          "message": [
            {
              "target": {
                "name": "energy drink",
                "description": "caffeine and taurine",
                "category": "drinks",
                "price": 2.555,
                "stock": 10
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

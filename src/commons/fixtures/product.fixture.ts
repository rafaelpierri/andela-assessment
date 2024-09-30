export async function insertIntoProducts(dataSource, products) {
  const results = [];
  for (const product of products) {
    const p = { ...product };
    results.push(
      await dataSource
        .createQueryBuilder()
        .insert()
        .into('products')
        .values(p)
        .returning('*')
        .execute(),
    );
  }
  return results;
}

const now = new Date();

export const productsFixture = [
  {
    name: 'energy drink',
    description: 'caffeine and taurine',
    category: 'drinks',
    price: 1,
    stock: 10,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'dice',
    description: 'd20',
    category: 'games',
    price: 2,
    stock: 10,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'carrot',
    description: 'orange carrot',
    category: 'foods',
    price: 3,
    stock: 10,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'beer',
    description: 'ipa',
    category: 'drinks',
    price: 4,
    stock: 10,
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'apple',
    description: 'healthy fruit',
    category: 'fruits',
    price: 5,
    stock: 10,
    createdAt: now,
    updatedAt: now,
  },
];

import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/dict/ProductController.test.ts', () => {

  it('should GET /api/products 列表', async () => {
    const res1 = await app.httpRequest()
      .get('/api/products')
      .expect(200);
    assert(typeof res1.body.total === 'number' && res1.body.list instanceof Array);
  });
});

import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/dict/ComboController.test.ts', () => {

  it('should GET /api/combos 列表', async () => {
    const res1 = await app.httpRequest()
      .get('/api/combos')
      .expect(200);
    assert(typeof res1.body.total === 'number' && res1.body.list instanceof Array);
  });
});

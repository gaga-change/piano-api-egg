import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/authController.test.ts', () => {
  it('should GET /api/auth/login 用户名为空', async () => {
    await app.httpRequest()
      .post('/api/auth/login')
      .send({
        username: '',
        password: '123',
      })
      .expect(422);
  });
  it('should GET /api/auth/login 密码为空', async () => {
    await app.httpRequest()
      .post('/api/auth/login')
      .send({
        username: '123',
        password: '',
      })
      .expect(422);
  });
  it('should GET /api/auth/login 用户名和密码为空', async () => {
    await app.httpRequest()
      .post('/api/auth/login')
      .send({
        username: '',
        password: '',
      })
      .expect(422);
  });
  it('should GET /api/auth/login 用户名和密码正确', async () => {
    const result: any = await app.httpRequest()
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: '123456',
      })
      .expect(200);
    assert(result.body && result.body.name === 'admin');
  });
  it('should GET /api/auth/logout 已登录', async () => {
    app.mockSession({
      user: {
        name: 'admin',
      },
    });
    await app.httpRequest()
      .get('/api/auth/logout')
      .expect(204);
    await app.httpRequest()
      .get('/api/auth/account')
      .expect(401);
  });
  it('should GET /api/auth/logout 未登录', async () => {
    await app.httpRequest()
      .get('/api/auth/logout')
      .expect(204);
  });
  it('should GET /api/auth/account 已登录', async () => {
    app.mockSession({
      user: {
        name: 'admin',
      },
    });
    await app.httpRequest()
      .get('/api/auth/account')
      .expect(200);
  });
  it('should GET /api/auth/account 未登录', async () => {
    await app.httpRequest()
      .get('/api/auth/account')
      .expect(401);
  });
});

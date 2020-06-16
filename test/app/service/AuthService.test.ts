import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/AuthService.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
  });

  it('AuthService login 正确密码', async () => {
    const { User } = ctx.model;
    const user = new User({ username: 'admin', password: '123456' });
    const res = await ctx.service.authService.login(user).catch(err => err);
    assert(res.name === user.username);
  });

  it('AuthService login 错误的密码', async () => {
    const { User } = ctx.model;
    const user = new User({ username: 'admin', password: '12345' });
    const res = await ctx.service.authService.login(user).catch(err => err);
    assert(res.constructor.name === 'BadRequestError' && res.message === '用户名或密码错误！');
  });
});

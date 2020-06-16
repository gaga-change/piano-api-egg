import code from '../config/code';
import { Context } from 'egg';
import wxAuth from './wxAuth';

// 这里是你自定义的中间件
export default function checkAuth(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    console.log('???? checkAuth');

    if (ctx.openid) {
      await wxAuth()(ctx, next);
    } else {
      ctx.assert(ctx.session.user, code.Unauthorized, '用户未登录');
      await next();
    }
  };
}

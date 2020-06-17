import code from '../config/code';
import { Context } from 'egg';
import wxAuth from './wxAuth';

export default function checkAuth(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    if (ctx.openid) {
      await wxAuth()(ctx, next);
    } else {
      ctx.assert(ctx.session.user, code.Unauthorized, '用户未登录');
      await next();
    }
  };
}

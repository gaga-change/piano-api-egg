import { Context } from 'egg';

export default function wxOpenid(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    const header = ctx.request.header;
    const host = header['x-forwarded-host'];
    ctx.isTeacher = host && host.includes('teacher');
    ctx.openid = ctx.session.openid;
    await next();
  };
}

import code from '../config/code';
import { Context } from 'egg';

export default function wxCheckOpenid(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    const openid = ctx.openid || undefined;
    const { Teacher, Student } = ctx.model;
    ctx.assert(openid, code.Unauthorized, '用户未登录');
    if (ctx.isTeacher) {
      ctx.state.user = await Teacher.findOne({ openid });
    } else {
      ctx.state.user = await Student.findOne({ openid });
    }
    await next();
  };
}

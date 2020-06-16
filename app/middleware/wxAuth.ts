/** 微信用户校验 */
import code from '../config/code';
import { Context } from 'egg';
import { PERSON_STATUS_PASS } from '../config/const';

// 这里是你自定义的中间件
export default function wxAuth(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    const openid = ctx.openid || undefined;
    const { Teacher, Student } = ctx.model;
    ctx.assert(openid, code.Unauthorized, '用户未登录');
    let user;
    if (ctx.isTeacher) {
      user = await Teacher.findOne({ openid });
    } else {
      user = await Student.findOne({ openid });
    }
    ctx.assert(user, code.Forbidden, '用户未提交资料');
    ctx.assert(user.status === PERSON_STATUS_PASS, code.Forbidden, '用户暂未审核通过');
    ctx.state.user = user;
    await next();
  };
}

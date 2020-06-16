import { Service } from 'egg';
import { UserDocument } from '../model/User';
import code from '../config/code';


function isAdmin(user: UserDocument) {
  return user.username === 'admin' && user.password === '123456';
}

function isCustomer(user: UserDocument) {
  return user.username === 'xiaozhang' && user.password === '123456';
}

export default class AuthService extends Service {
  public async login(user: UserDocument): Promise<{ name: string; role?: string }> {
    const ctx = this.ctx;
    ctx.assert(isAdmin(user) || isCustomer(user), code.BadRequest, '用户名或密码错误！');
    if (isAdmin(user)) {
      ctx.session.user = { name: 'admin', role: 'admin' };
    } else {
      ctx.session.user = { name: '小张' };
    }
    return ctx.session.user;
  }
}

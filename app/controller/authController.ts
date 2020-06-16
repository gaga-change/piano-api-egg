import { Controller } from 'egg';


export default class AuthController extends Controller {

  /**
   * 登录
   */
  async login() {
    const ctx = this.ctx;
    const { body } = ctx.request;
    ctx.validate({ username: 'string', password: 'string' });
    ctx.body = await this.service.authService.login(body);
  }

  /**
   * 退出登录
   */
  async logout() {
    const ctx = this.ctx;
    ctx.session.user = null;
    ctx.body = null;
  }

  /**
   * 获取当前登录用户
   */
  async account() {
    console.log('????? ');
    const ctx = this.ctx;
    ctx.body = ctx.session.user;
  }
}

import { Controller } from 'egg';

export default class EnumsController extends Controller {
  /**
   * 获取所有枚举
   */
  async total() {
    const { ctx } = this;
    ctx.body = await ctx.service.enumService.total();
  }
}

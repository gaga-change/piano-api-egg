import { Controller } from 'egg';

export default class DashboardController extends Controller {

  /**
   * 控制台数据信息
   */
  async readyDataNum() {
    const { ctx } = this;
    ctx.body = await ctx.service.dashboardService.readyNum();
  }
}

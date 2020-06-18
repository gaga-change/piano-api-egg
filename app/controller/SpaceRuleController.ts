import BaseController from '../code/BaseController';


export default class SpaceRuleController extends BaseController {

  constructor(ctx) {
    super('SpaceRule', {}, ctx);
  }

  /**
   * 清理 主文档被删除的文档
   */
  async clearDiscardDoc() {
    const { ctx } = this;
    ctx.body = await ctx.service.spaceRuleService.clearDiscardDoc();
  }

  /**
   * 批量修改
   */
  async spaceRulesUpdate() {
    const { ctx } = this;
    const { del = [], add = [] } = ctx.request.body;
    ctx.assert(del.length || add.length, 400, '参数异常');
    await ctx.service.spaceRuleService.spaceRulesUpdate(ctx.request.body);
    ctx.body = ctx.request.body;
  }

  /**
   * 获取个人空闲时间
   */
  async getSelfSpaceAreaInSpaceRule() {
    const { ctx } = this;
    const query = ctx.query;
    ctx.assert(query.date, 400, 'date 必传');
    ctx.body = await ctx.service.spaceRuleService.getSelfSpaceAreaInSpaceRule(query);
  }

  /**
   * 传递时间范围，查询符合条件对象的空闲时间
   */
  // @GetMapping('getSpaceArea', [checkAuth])
  async getSpaceArea() {
    const { ctx } = this;
    const query = ctx.query;
    ctx.assert(query.startTime && query.endTime, 400, 'startTime, endTime 必传');
    ctx.body = await ctx.service.spaceRuleService.getSpaceArea(query);
  }
}

import BaseController from '../code/BaseController';

export default class ShareController extends BaseController {

  constructor(ctx) {
    super('Share', {}, ctx);
  }

  async index(): Promise<void> {
    const { ctx } = this;
    const query = ctx.query;
    ctx.body = await ctx.service.shareService.index(query);
  }
}

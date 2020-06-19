import BaseController from '../code/BaseController';
import { ShareDocument } from '../model/Share';

export default class ShareController extends BaseController<ShareDocument> {

  constructor(ctx) {
    super('Share', {}, ctx);
  }

  async index(): Promise<void> {
    const { ctx } = this;
    const query = ctx.query;
    ctx.body = await ctx.service.shareService.index(query);
  }
}

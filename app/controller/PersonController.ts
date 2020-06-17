import BaseController from '../BaseController';

export default class PersonController extends BaseController {
  constructor(args) {
    super('Person', {
      defaultSort: { createdAt: -1 },
    }, args);
  }

  async index() {
    const { ctx } = this;
    const query = ctx.query;

    ctx.body = await ctx.service.personService.list(query, this.defaultSort);
  }
}

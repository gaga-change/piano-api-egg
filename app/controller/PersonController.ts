import BaseController from '../code/BaseController';

export default class PersonController extends BaseController {
  constructor(args) {
    super('Person', {}, args);
  }

  async index() {
    const { ctx } = this;
    const query = ctx.query;
    ctx.body = await ctx.service.personService.list(query);
  }
}

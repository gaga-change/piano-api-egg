import BaseController from '../code/BaseController';
import { PersonDocument } from '../model/Person';

export default class PersonController extends BaseController<PersonDocument> {
  constructor(args) {
    super('Person', {}, args);
  }

  public async index() {
    const { ctx } = this;
    const query = ctx.query;
    ctx.body = await ctx.service.personService.list(query);
  }
}

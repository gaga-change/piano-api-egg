import { pageable } from '../tools/pageable';
import { PersonDocument } from '../model/Person';
import BaseService from '../code/BaseService';

export default class PersonService extends BaseService<PersonDocument> {

  constructor(ctx) {
    super('Person', {}, ctx);
  }

  /**
   * 列表查询
   * @param query 查询条件
   * @param sort 排序
   */
  public async list(query: any, sort: any = { createdAt: -1 }) {
    const { ctx } = this;
    const { Person } = ctx.model;
    const { skip, limit, params } = pageable(query, Person, { fuzzy: false });
    if (params.name) {
      params.$or = [{ name: new RegExp(params.name, 'i') }, { phone: new RegExp(params.name) }];
      delete params.name;
    }
    const res1 = Person.find(params)
      .sort(sort)
      .limit(limit)
      .skip(skip);
    const res2 = Person.countDocuments(params);
    return {
      total: await res2,
      list: await res1,
    };
  }
}

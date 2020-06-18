import { Service } from 'egg';
import { Model, Document } from 'mongoose';
import code from '../config/code';
import { pageable } from '../tools/pageable';

export interface BaseControllerOptions {
  defaultSort?: any;
  duplicateKey?: any; // 哪些至是不能重复的，且备注中文名
  indexPopulate?: Array<any>;
  showPopulate?: Array<any>;
}

export default class BaseService extends Service {
  public Model: Model<any>;
  public defaultSort: any;
  private readonly duplicateKey: any;
  private readonly indexPopulate?: Array<any>;
  private readonly showPopulate?: Array<any>;

  constructor(modelName: string, options: BaseControllerOptions, args) {
    super(args);
    this.Model = this.ctx.model[modelName];
    this.defaultSort = options.defaultSort || { createdAt: -1 };
    this.duplicateKey = options.duplicateKey;
    this.indexPopulate = options.indexPopulate;
    this.showPopulate = options.showPopulate;
  }

  async create(body: any) {
    const { ctx } = this;
    ctx.state.duplicateKey = this.duplicateKey;
    const model = new this.Model(body);
    return await model.save();
  }

  async destroy(id: string) {
    return this.Model.deleteOne({ _id: id });
  }

  async update(id: string, body: any, oldDataCb?: (model: Document) => Promise<any>) {
    const { ctx } = this;
    ctx.state.duplicateKey = this.duplicateKey;
    const model = await this.Model.findById(id);
    ctx.assert(model, code.BadRequest, '数据已被删除！');
    if (oldDataCb) {
      await oldDataCb(model);
    }
    model.set(body);
    await model.save();
    return model;
  }

  async show(id: string) {
    const { ctx } = this;
    const search = this.Model.findById(id);
    if (this.showPopulate) {
      this.showPopulate.forEach(v => search.populate(v));
    }
    const model = await search;
    ctx.assert(model, code.BadRequest, '数据已被删除！');
    return model;
  }

  async index(query: any) {
    const { skip, limit, params } = pageable(query, this.Model);
    const res1 = this.Model.find(params)
      .sort(this.defaultSort)
      .limit(limit)
      .skip(skip);
    if (this.indexPopulate) {
      this.indexPopulate.forEach(v => res1.populate(v));
    }
    const res2 = this.Model.countDocuments(params);
    return {
      total: await res2,
      list: await res1,
    };
  }
}

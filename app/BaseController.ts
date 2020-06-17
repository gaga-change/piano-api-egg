import { Controller } from 'egg';
import { Model } from 'mongoose';
import code from './config/code';
import { pageable } from './tools/pageable';

interface BaseControllerrOptions {
  defaultSort?: any;
  duplicateKey?: any;
}

export default class BaseController extends Controller {
  public Model: Model<any>;
  public defaultSort: any;
  public duplicateKey: any;

  constructor(modelName: string, options: BaseControllerrOptions, args) {
    super(args);
    this.Model = this.ctx.model[modelName];
    this.defaultSort = options.defaultSort || { createdAt: -1 };
    this.duplicateKey = options.duplicateKey;
  }

  async create() {
    const { ctx } = this;
    ctx.state.duplicateKey = this.duplicateKey;
    const model = new this.Model(ctx.request.body);
    ctx.body = await model.save();
  }

  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;

    await this.Model.deleteOne({ _id: id });
    ctx.body = null;
  }

  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const item = ctx.request.body;
    const model = await this.Model.findById(id);
    ctx.state.duplicateKey = this.duplicateKey;
    ctx.assert(model, code.BadRequest, '数据已被删除！');
    model.set(item);
    await model.save();
    ctx.body = model;
  }

  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const model = await this.Model.findById(id);
    ctx.assert(model, code.BadRequest, '数据已被删除！');
    ctx.body = model;
  }

  async index() {
    const { ctx } = this;
    const query = ctx.query;
    const { skip, limit, params } = pageable(query, this.Model);
    const res1 = this.Model.find(params)
      .sort(this.defaultSort)
      .limit(limit)
      .skip(skip);
    const res2 = this.Model.countDocuments(params);
    ctx.body = {
      total: await res2,
      list: await res1,
    };
  }
}

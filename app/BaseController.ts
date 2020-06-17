import { Controller } from 'egg';
import { Model } from 'mongoose';
import code from './config/code';

interface BaseControllerrOptions {
  defaultSort?: any;
  duplicateKey?: any;
}

export default class BaseController extends Controller {
  public Model: Model<any>;
  private defaultSort: any;
  private duplicateKey: any;

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
    const pageSize = Number(ctx.query.pageSize) || 20;
    const page = Number(ctx.query.pageNum) || 1;
    const params = { ...query };
    delete params.pageSize;
    delete params.pageNum;
    Object.keys(params).forEach(key => {
      if (this.Model.schema.obj[key] && this.Model.schema.obj[key].type === String) {
        params[key] = new RegExp(params[key], 'i');
      }
    });
    const res1 = this.Model.find(params)
      .sort(this.defaultSort)
      .limit(pageSize)
      .skip((page - 1) * pageSize);
    const res2 = this.Model.countDocuments(params);
    ctx.body = {
      total: await res2,
      list: await res1,
    };
  }
}

import { Service } from 'egg';
import { Model, Document, Schema } from 'mongoose';
import { pageable } from '../tools/pageable';
import ThrowError from '../tools/ThrowError';

export interface BaseControllerOptions{
  defaultSort?: any;
  duplicateKey?: any; // 哪些至是不能重复的，且备注中文名
  indexPopulate?: Array<any>;
  showPopulate?: Array<any>;
}

export default class BaseService<T extends Document> extends Service {
  public Model: Model<T>;
  public defaultSort: any;
  private readonly duplicateKey: any;
  public readonly indexPopulate?: Array<any>;
  public readonly showPopulate?: Array<any>;

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
    const { session } = ctx.state;
    ctx.state.duplicateKey = this.duplicateKey;
    const model = new this.Model(body);
    return await model.save({ session });
  }

  async destroy(id: string) {
    const { session } = this.ctx.state;
    return this.Model.findByIdAndRemove(id, { session });
  }

  async update(id: string, body: any, oldDataCb?: (model: Document) => Promise<any>) {
    const { ctx } = this;
    const { session } = ctx.state;

    ctx.state.duplicateKey = this.duplicateKey;
    const model = await this.Model.findById(id);
    if (!model) throw new ThrowError('数据已被删除！');
    if (oldDataCb) {
      await oldDataCb(model);
    }
    model.set(body);
    await model.save({ session });
    return model;
  }

  /**
   * 查询
   * @param id ID
   * @param options 参数
   */
  public async show(id: Schema.Types.ObjectId | T | string | null, options: {populate: boolean} = { populate: true }): Promise<T> {
    const { session } = this.ctx.state;
    let getId;
    if (id === null) {
      new ThrowError('参数不能传Null！');
    } else if (typeof id === 'string') {
      getId = id;
    } else if ('_id' in id) {
      getId = id._id;
    } else {
      getId = id;
    }
    const search = this.Model.findById(getId, undefined, { session });
    if (options.populate && this.showPopulate) {
      this.showPopulate.forEach(v => search.populate(v));
    }
    const model = await search;
    if (!model) throw new ThrowError('数据已被删除！');
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

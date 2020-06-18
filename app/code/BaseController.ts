import { Controller } from 'egg';
import BaseService, { BaseControllerOptions } from './BaseService';

export default class BaseController extends Controller {
  public baseService: BaseService
  constructor(modelName: string, options: BaseControllerOptions, args) {
    super(args);
    this.baseService = new BaseService(modelName, options, args);
  }

  async create() {
    const { ctx } = this;
    ctx.body = await this.baseService.create(ctx.request.body);
  }

  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.body = await this.baseService.destroy(id);
  }

  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const item = ctx.request.body;
    ctx.body = await this.baseService.update(id, item);
  }

  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.body = await this.baseService.show(id);
  }

  async index() {
    const { ctx } = this;
    const query = ctx.query;
    ctx.body = await this.baseService.index(query);
  }
}

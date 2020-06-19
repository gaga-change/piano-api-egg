import _ from 'lodash';
import BaseController from '../code/BaseController';
import { OrderDocument } from '../model/Order';


export default class OrderController extends BaseController<OrderDocument> {
  constructor(ctx) {
    super('Order', {
      indexPopulate: [ 'product', 'student' ],
      showPopulate: [ 'product', 'student' ],
    }, ctx);
  }

  /**
   * 获取未完成的订单
   */
  async findByStudentAndNoComplete() {
    const { ctx } = this;
    const query = ctx.query || {};
    ctx.body = await ctx.service.orderService.findByStudentAndNoComplete(query);
  }

  /**
   * 创建订单
   */
  async create(): Promise<void> {
    const { ctx } = this;
    const body = ctx.request.body;
    ctx.body = await ctx.service.orderService.create(body);
  }

  /**
   * 修改订单
   */
  async update(): Promise<void> {
    const { ctx } = this;
    const { id } = ctx.params;
    // 剩余时间、课程、学生不允许修改
    const item = _.omit(ctx.request.body, [ 'excessTime', 'product', 'student' ]);
    ctx.body = await this.baseService.update(id, item);
  }
}

import BaseService from '../code/BaseService';
import ThrowError from '../tools/ThrowError';
import { OrderDocument } from '../model/Order';

export default class OrderService extends BaseService<OrderDocument> {
  constructor(ctx) {
    super('Order', {}, ctx);
  }

  /**
   * 获取未完成的订单
   * @param query 查询条件
   */
  async findByStudentAndNoComplete(query) {
    return this.Model.find({
      excessTime: { $ne: 0 },
      cancel: false,
      ...query,
    })
      .populate('product')
      .populate('student')
      .sort({ createdAt: -1 });
  }

  /**
   * 创建
   * @param body 创建对象
   */
  async create(body: any): Promise<OrderDocument> {
    const { Order, Product } = this.app.model;
    const order = new Order(body);
    const product = await Product.findById(order.product);
    if (!product) throw new ThrowError('商品已被删除');
    order.excessTime = product && product.time; // 剩余时间 初始 等于商品的总时间
    return order.save();
  }

  /**
   * 更新订单的时间
   * @param orderId 订单id
   * @param time 订单时间
   */
  public async updateTime(orderId: string, time: number): Promise<OrderDocument> {
    const { Order } = this.app.model;
    const { session } = this.ctx.state;
    const order = await Order.findByIdAndUpdate(orderId, { $inc: { excessTime: time } }, {
      new: true,
      session,
    });
    if (!order) throw new ThrowError('订单不存在');
    if (order.excessTime < 0) throw new ThrowError('订单剩余时间不足！');
    return order;
  }
}

import BaseService from '../code/BaseService';
import ThrowError from '../tools/ThrowError';
import { OrderDocument } from '../model/Order';

export default class OrderService extends BaseService {
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
}

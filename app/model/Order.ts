
import { Document, Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { StudentDocument } from './Student';
import { ProductDocument } from './Product';

export interface OrderDocument extends Document {
  product: ProductDocument | string | null;
  student: StudentDocument | string | null;
  excessTime: number;
  cancel: boolean;
  remark: string;
}

export default (): Model<OrderDocument> => {


  const schema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // 商品
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true }, // 学生
    excessTime: { type: Number, default: 0 }, // 剩余课时
    cancel: { type: Boolean, default: false }, // 是否取消
    remark: { type: String, default: '', trim: true }, // 备注
  }, {
    timestamps: true,
  });

  return mongoose.model<OrderDocument>('Order', schema, 'piano_order');
};


import { Document, Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';

export interface DictDocument extends Document {
  kind: string;
  name: string;
  disabled: boolean;
  remark?: string;
}

const schema = new Schema({
  name: { type: String, default: '', trim: true, maxlength: 100 }, // 名称
  disabled: { type: Boolean, default: false }, // 是否禁用
  remark: { type: String, default: '', trim: true, maxlength: 300 }, // 备注
}, {
  timestamps: true,
  discriminatorKey: 'kind',
});
const model = mongoose.model<DictDocument>('Dict', schema, 'piano_dict');
export default (): Model<DictDocument> => model;

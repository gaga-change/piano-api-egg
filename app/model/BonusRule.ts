
import { Document, Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { TeacherTypeDocument } from './TeacherType';
import { ClassTimeDocument } from './ClassTime';


export interface BonusRuleDocument extends Document {
  teacherType: TeacherTypeDocument | string | null;
  classTime: ClassTimeDocument | string | null;
  price: number;
  disabled: boolean;
  remark: string;
}

export default (): Model<BonusRuleDocument> => {
  const schema = new Schema({
    teacherType: { type: Schema.Types.ObjectId, ref: 'TeacherType', required: true },
    classTime: { type: Schema.Types.ObjectId, ref: 'ClassTime', required: true },
    price: { type: Number, default: 0 },
    remark: { type: String, default: '', trim: true }, // 备注
    disabled: { type: Boolean, default: false }, // 是否禁用
  }, {
    timestamps: true,
  });
  return mongoose.model<BonusRuleDocument>('BonusRule', schema, 'piano_bonus_rules');
};


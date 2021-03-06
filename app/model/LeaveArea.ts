
import { Document, Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { CourseDocument } from './Course';
import { LEAVE_AREA_STATUS_READY } from '../config/const';
import { LEAVE_AREA_STATUS_MAP } from '../config/enums';
import { PersonDocument } from './Person';


export interface LeaveAreaDocument extends Document{
  course: CourseDocument | string | null;
  person: PersonDocument | string | null;
  adverse: PersonDocument | string | null;
  status: number;
  remark: string;
  reason: string;
}

export default (): Model<LeaveAreaDocument> => {

  const schema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    adverse: { type: Schema.Types.ObjectId, ref: 'Person', required: true }, // 请假影响到的对方
    status: { type: Number, default: LEAVE_AREA_STATUS_READY, enum: [ ...LEAVE_AREA_STATUS_MAP.keys() ] }, // 状态
    remark: { type: String, default: '', trim: true }, // 备注
    reason: { type: String, default: '', trim: true }, // 理由
  }, {
    timestamps: true,
  });


  return mongoose.model<LeaveAreaDocument>('LeaveArea', schema, 'piano_leave_area');
};

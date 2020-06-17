import { Document, Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { PERSON_DB_NAME } from '../config/dbName';
import { PERSON_STATUS_MAP } from '../config/enums';

export interface PersonDocument extends Document {
  kind: string;
  name: string;
  status: number;
  phone: string;
  openid?: string;
  remark?: string;
  isService?: boolean;
  qrcodeTeacherTicket?: string; // 个人分享二维码 ticket 老师端
  qrcodeStudentTicket?: string; // 个人分享二维码 ticket 学生端
}

const schema = new Schema({
  name: { type: String, default: '', trim: true, maxlength: 100 }, // 名称
  status: { type: Number, default: 0, enum: [ ...PERSON_STATUS_MAP.keys() ] }, // 状态
  phone: { type: String, maxlength: 100 }, // 手机号码
  openid: { type: String, maxlength: 200 }, // wx openId
  remark: { type: String, default: '', trim: true, maxlength: 500 }, // 备注
  isService: { type: Boolean, default: false }, // 是否为客服
  qrcodeTeacherTicket: { type: String, maxlength: 500 },
  qrcodeStudentTicket: { type: String, maxlength: 500 },
}, {
  timestamps: true,
  discriminatorKey: 'kind',
});

const model = mongoose.model<PersonDocument>('Person', schema, PERSON_DB_NAME);

export default (): Model<PersonDocument> => model;

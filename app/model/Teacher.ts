
import { Model, Schema } from 'mongoose';
import { TEACHER_DB_NAME } from '../config/dbName';
import { ClassTimeDocument } from './ClassTime';
import Person, { PersonDocument } from './Person';

export interface TeacherDocument extends PersonDocument {
  school?: string;
  major?: string;
  grade?: number;
  type?: Schema.Types.ObjectId | ClassTimeDocument | string;
}

export default (): Model<TeacherDocument> => {
  const schema = new Schema({
    school: { type: String, trim: true }, // 学校
    major: { type: String, trim: true }, // 专业
    type: { type: Schema.Types.ObjectId, ref: 'TeacherType' }, // 类型
  }, {
    timestamps: true,
    discriminatorKey: 'kind',
  });

  return Person().discriminator<TeacherDocument>('Teacher', schema, TEACHER_DB_NAME);
};

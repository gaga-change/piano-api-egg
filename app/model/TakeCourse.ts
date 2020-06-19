import { TeacherDocument } from './Teacher';
import { StudentDocument } from './Student';
import { ClassTypeDocument } from './ClassType';
import { ClassTimeDocument } from './ClassTime';
import { CourseDocument } from './Course';
import { OrderDocument } from './Order';

import { Document, Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';

export interface TakeCourseDocument extends Document {
  startTime: Date;
  student: StudentDocument | string | null;
  teacher?: TeacherDocument | string | null;
  course?: CourseDocument | string | null;
  classType: ClassTypeDocument | string | null;
  classTime: ClassTimeDocument | string | null;
  order?: OrderDocument | string | null;
  teacherTypes: Array<string>;
  cancel: boolean;
  remark?: string;
}

export default (): Model<TakeCourseDocument> => {

  const schema = new Schema({
    startTime: { type: Date, required: true }, // 开始时间
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    classType: { type: Schema.Types.ObjectId, ref: 'ClassType', required: true }, // 课类型
    classTime: { type: Schema.Types.ObjectId, ref: 'ClassTime', required: true }, // 课时长
    order: { type: Schema.Types.ObjectId, ref: 'Order' }, // 订单
    teacherTypes: [ Schema.Types.ObjectId ], // 教师类型
    cancel: { type: Boolean, default: false },
    remark: { type: String, default: '', trim: true }, // 备注
  }, {
    timestamps: true,
  });

  return mongoose.model<TakeCourseDocument>('TakeCourse', schema, 'piano_take_course');
};

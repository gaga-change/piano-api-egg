import { Service } from 'egg';
import ThrowError from '../tools/ThrowError';
import { PERSON_STATUS_PASS } from '../config/const';

export default class StudentService extends Service {
  public async update(id: string, body: any) {
    const { ctx } = this;
    const { Student } = ctx.model;
    const student = await Student.findById(id);
    if (!student) throw new ThrowError('数据已删除');
    const oldStatus = student.status;
    student.set(body);
    await student.save();
    const newStatus = student.status;
    if (newStatus === PERSON_STATUS_PASS && oldStatus !== PERSON_STATUS_PASS) {
      // 通知学生注册成功
      await ctx.service.wx.pushMsg.studentRegisterSuccess(body);
    }
  }
}

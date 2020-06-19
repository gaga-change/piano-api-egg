import BaseService from '../code/BaseService';
import { TakeCourseDocument } from '../model/TakeCourse';
import { getId } from '../tools/getID';

export default class TakeCourseService extends BaseService<TakeCourseDocument> {
  constructor(ctx) {
    super('TakeCourse', {
      indexPopulate: [ 'teacher', 'student', 'course', 'classType', 'classTime', { path: 'order', populate: 'product' }],
      showPopulate: [ 'teacher', 'student', 'course', 'classType', 'classTime', { path: 'order', populate: 'product' }],
    }, ctx);
  }

  public async create(body: any): Promise<TakeCourseDocument> {
    const takeCourse = await super.create(body);
    this.pushMsg(takeCourse._id);
    return takeCourse;
  }

  private pushMsg(takeCouseId: string) {
    const { ctx } = this;
    const { Teacher } = ctx.model;
    setImmediate(async () => {
      // 消息推送
      const takeCourse = await this.show(takeCouseId);
      const student = await ctx.service.studentService.show(getId(takeCourse.student));
      const teacherTypes = takeCourse.teacherTypes;
      if (teacherTypes && teacherTypes.length) {
        const teachers = await Teacher.find({ type: { $in: teacherTypes } });
        console.log('消息推送 ', teachers.map(v => v.name));
        teachers.forEach(teacher => {
          ctx.service.wx.pushMsg.teacherTakeCourse(teacher, student, takeCourse);
        });
      }
    });
  }
}

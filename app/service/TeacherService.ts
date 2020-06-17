import { PERSON_STATUS_PASS } from '../config/const';
import BaseService from '../code/BaseService';
import { TeacherDocument } from '../model/Teacher';

export default class TeacherService extends BaseService {
  constructor(ctx) {
    super('Teacher', {}, ctx);
  }
  public async update(id: string, body: any): Promise<TeacherDocument> {
    const { ctx } = this;
    let oldStatus = -1;
    const teacher = await super.update(id, body, async teacher => {
      oldStatus = (teacher as TeacherDocument).status;
    });
    if (teacher.newStatus === PERSON_STATUS_PASS && oldStatus !== PERSON_STATUS_PASS) {
      await ctx.service.wx.pushMsg.teacherRegisterSuccess(teacher);
    }
    return teacher;
  }
}

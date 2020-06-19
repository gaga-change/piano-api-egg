import BaseService from '../code/BaseService';
import { LeaveAreaDocument } from '../model/LeaveArea';
import { COURSE_PERSON_STATUS_LEAVE, COURSE_STATUS_NO_PASS, LEAVE_AREA_STATUS_PASS } from '../config/const';
import { TEACHER_DB_NAME } from '../config/dbName';

export default class LeaveAreaService extends BaseService<LeaveAreaDocument> {
  constructor(ctx) {
    super('LeaveArea', {}, ctx);
  }

  public async create(): Promise<LeaveAreaDocument> {
    const { ctx } = this;
    const leaveArea = await super.create(ctx.request.body);
    if (leaveArea.status === LEAVE_AREA_STATUS_PASS) { // 生效
      await this.passLeaveArea(leaveArea);
    }
    return leaveArea;
  }

  public async update(id: string, item: any): Promise<LeaveAreaDocument> {
    let oldStatus = -1;
    const leaveArea = await super.update(id, item, async leaveArea => {
      oldStatus = leaveArea.status;
    });
    if (oldStatus !== LEAVE_AREA_STATUS_PASS && leaveArea.status === LEAVE_AREA_STATUS_PASS) { // 之前未通过，然后改成通过
      await this.passLeaveArea(leaveArea);
    }
    return leaveArea;
  }


  /**
   * 请假通过后修改 课程状态
   * @param leaveArea LeaveArea
   */
  private async passLeaveArea(leaveArea: LeaveAreaDocument) {
    const { ctx } = this;
    const { session } = ctx.state;
    const update: any = { status: COURSE_STATUS_NO_PASS };
    const person = await ctx.service.personService.show(leaveArea.person, { populate: false });
    if (person.kind === TEACHER_DB_NAME) {
      update.teacherStatus = COURSE_PERSON_STATUS_LEAVE;
    } else {
      update.studentStatus = COURSE_PERSON_STATUS_LEAVE;
    }
    const course = await ctx.service.courseService.save(update, leaveArea.person as string);
    let adverse;
    if (person.kind === TEACHER_DB_NAME) { // 给请假赋上 另一个对象
      adverse = course.student;
    } else {
      adverse = course.teacher;
    }
    leaveArea.adverse = adverse;
    await leaveArea.save({ session });
  }
}

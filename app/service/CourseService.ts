import BaseService from '../code/BaseService';
import { initHour, ONE_DAY_TIME } from '../tools/dateTools';
import { TEACHER_DB_NAME } from '../config/dbName';
import { COURSE_STATUS_NO_PASS, COURSE_STATUS_READY } from '../config/const';
import { CourseDocument } from '../model/Course';
import { STUDENT_TYPE, TEACHER_TYPE } from '../tools/wxTools';
import { getId } from '../tools/getID';

export default class CourseService extends BaseService<CourseDocument> {
  constructor(ctx) {
    super('Course', {
      indexPopulate: [
        { path: 'teacher', select: 'name' },
        { path: 'student', select: 'name' },
        { path: 'classType', select: 'name' },
        { path: 'classTime', select: 'name time' },
        { path: 'order', populate: 'product' },
      ],
      showPopulate: [
        { path: 'teacher', select: 'name' },
        { path: 'student', select: 'name' },
        { path: 'classType', select: 'name' },
        { path: 'classTime', select: 'name time' },
        { path: 'order', populate: 'product' },
      ],
    }, ctx);
  }

  /**
   * 查询某人某月的所有课程
   * @param personId 用户id
   * @param month 月份时间
   */
  public async findByPersonAndMonth(personId: string, month: string) {
    const { ctx } = this;
    const { Course } = ctx.model;
    const monthStart = new Date(month);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(monthStart);
    if (monthStart.getMonth() === 11) {
      monthEnd.setMonth(0);
      monthEnd.setFullYear(monthStart.getFullYear() + 1);
    } else {
      monthEnd.setMonth(monthStart.getMonth() + 1);
    }
    return Course.find({
      $or: [{ teacher: personId }, { student: personId }],
      startTime: { $gte: monthStart, $lt: monthEnd },
    }).populate('teacher').populate('student')
      .populate('classType')
      .populate('classTime');
  }

  /**
   * 获取当前周期内的 所有课程（学生或老师）
   * @param teacher 教师id
   * @param student 学生id
   */
  public async coursesActivateArea(teacher?: string, student?: string) {
    const { ctx } = this;
    const { Course } = ctx.model;
    return Course.findByActivateArea({ teacher, student });
  }

  /**
   * 获取某人某天未开始的课程
   * @param personId 用户id
   * @param date 时间
   */
  public async findByPersonAndDay(personId: string, date: string) {
    const { ctx } = this;
    const { Course } = ctx.model;
    const person = await ctx.service.personService.show(personId);
    const startTime = initHour(date);
    const endTime = new Date(startTime.getTime() + ONE_DAY_TIME);
    const appendQuery = person.kind === TEACHER_DB_NAME ? { teacher: person } : { student: person };
    return Course.find({
      ...appendQuery,
      startTime: { $gte: startTime, $lt: endTime },
      status: COURSE_STATUS_READY,
    }).populate('teacher').populate('student');
  }


  public async save(body: any, id?: string) {
    const { ctx } = this;
    const { service } = ctx;
    const { Course } = ctx.model;
    const { session } = ctx.state;
    let course;
    if (id) {
      course = await this.show(id, { populate: false });
      const classTime = await service.classTimeService.show(getId(course.classTime));
      // 还原订单
      course.order && await ctx.service.orderService.updateTime(getId(course.order), classTime.time);
      course.set(body);
    } else {
      course = new Course(body);
    }
    const classTime = await service.classTimeService.show(getId(course.classTime));
    const endTime = new Date(new Date(course.startTime).getTime() + classTime.time * 60 * 1000);
    course.set({ endTime });
    if (course.status !== COURSE_STATUS_NO_PASS) { // 不是取消的课程
      // 查询和非本课程的其他课程 是否有重叠，排除对方请假的
      await this.checkCourseDuplicate(course);
      if (course.order) {
        // 减少订单时间
        await ctx.service.orderService.updateTime(getId(course.order), -classTime.time);
      }
    }

    return course.save({ session }); // 保存更新
  }

  /**
   * 校验课程是否时间重叠
   * @param course 课程
   */
  private async checkCourseDuplicate(course: CourseDocument) {
    const { ctx } = this;
    const coursesByStudent = await this.findByTimeArea(course, STUDENT_TYPE);
    ctx.assert(coursesByStudent.length === 0, 400, '学生课程时间有重叠');
    const courseByTeacher = await this.findByTimeArea(course, TEACHER_TYPE);
    ctx.assert(courseByTeacher.length === 0, 400, '教师课程时间有重叠');
  }

  private async findByTimeArea(course: CourseDocument, type: string) {
    const { ctx } = this;
    const { session } = ctx.state;

    const isTeacher = type === TEACHER_TYPE;
    const { Course } = this.app.model;
    return await Course.findByTimeArea(course.startTime, course.endTime,
      isTeacher ? getId(course.teacher) : undefined,
      isTeacher ? undefined : getId(course.student),
      {
        _id: { $ne: course._id },
        status: COURSE_STATUS_READY,
      }, session,
    );
  }
}


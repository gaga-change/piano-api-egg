import BaseService from '../code/BaseService';
import { copyFullYears, ONE_DAY_TIME } from '../tools/dateTools';
import { STUDENT_DB_NAME, TEACHER_DB_NAME } from '../config/dbName';
import { COURSE_PERSON_STATUS_LEAVE, COURSE_STATUS_NO_PASS, COURSE_STATUS_READY } from '../config/const';
import { SpaceRuleDocument } from '../model/SpaceRule';
import { CourseDocument } from '../model/Course';
import ThrowError from '../tools/ThrowError';

interface SpaceAreaDocument {
  startTime: Date;
  endTime: Date;
}

export default class SpaceRuleService extends BaseService<SpaceRuleDocument> {
  constructor(ctx) {
    super('SpaceRule', {}, ctx);
  }

  private cropAreaTime(spaceAreas: Array<SpaceAreaDocument>, courses: Array<CourseDocument>): Array<SpaceAreaDocument> {
    for (let j = 0; j < courses.length; j++) {
      const course: CourseDocument = courses[j];
      const { startTime: st, endTime: et } = course;
      const newTemp: { startTime: Date; endTime: Date }[] = [];
      spaceAreas.forEach(({ startTime, endTime }) => {
        // 获取交集
        const intersectionArea = [ Math.max(startTime.getTime(), st.getTime()), Math.min(endTime.getTime(), et.getTime()) ];
        // 判断交集是否成立
        if (intersectionArea[1] > intersectionArea[0]) {
          // 从area01中 删除交集
          if (startTime.getTime() < intersectionArea[0]) {
            newTemp.push({ startTime, endTime: new Date(intersectionArea[0] - 60 * 1000) });
          }
          if (intersectionArea[1] < endTime.getTime()) {
            newTemp.push({ startTime: new Date(intersectionArea[1] + 60 * 1000), endTime });
          }
        } else {
          newTemp.push({ startTime, endTime });
        }
      });
      spaceAreas = newTemp;
    }
    return spaceAreas;
  }

  /**
   * 清理没有主文档的数据
   */
  public async clearDiscardDoc() {
    const { SpaceRule } = this.app.model;
    await SpaceRule.removeNoTeacherOrStudent();
  }

  /**
   * 批量修改
   */
  public async spaceRulesUpdate(body: {del: Array<any>; add: Array<any>; person: any }) {
    const { ctx } = this;
    const { SpaceRule } = this.app.model;
    const { session } = ctx.state;
    const { del: delIds = [], add: addItems = [], person } = body;
    for (const i in addItems) {
      const temp = { ...addItems[i], person };
      await new SpaceRule(temp).save({ session });
    }
    if (delIds.length) {
      await SpaceRule.deleteMany({ _id: { $in: delIds } }, { session });
    }
    // 校验规则（不能有连续的时间，不能重叠）
    {
      const rules = await SpaceRule.find({ person }, undefined, { session }).sort('startTime');
      if (rules.length > 1) {
        for (let i = 0; i < (rules.length - 1); i++) {
          const temp = rules[i];
          const next = rules[i + 1];
          ctx.assert(temp.endTime.getTime() < next.startTime.getTime(), 400, '时间段不能连续或重叠');
        }
      }
    }
  }

  public async getSelfSpaceAreaInSpaceRule(query: any) {
    const { ctx } = this;
    const { SpaceRule, Person, Course } = ctx.model;
    const oneDay: Date = new Date(query.date);
    const person = await Person.findById(query.person);
    if (!person) throw new ThrowError('人物已被删除');
    // 查询时间有交集的规则
    // 1. 查询个人规则
    let startTime = new Date(2019, 6, oneDay.getDay() === 0 ? 7 : oneDay.getDay(), 0, 0, 0, 0);
    let endTime = new Date(2019, 6, (oneDay.getDay() === 0 ? 7 : oneDay.getDay()) + 1, 0, 0, 0, 0);
    const spaceRules = await SpaceRule.find({ startTime: { $gte: startTime }, endTime: { $lt: endTime }, person });
    const spaceAreas: Array<SpaceAreaDocument> = spaceRules.map(v => ({
      startTime: copyFullYears(v.startTime, oneDay),
      endTime: copyFullYears(v.endTime, oneDay),
    }));
    startTime = copyFullYears(startTime, oneDay);
    endTime = new Date(startTime.getTime() + ONE_DAY_TIME);
    // 查询有交集的课程，进行裁剪
    const appendQuery: {student?: any;teacher?: any} = person.kind === STUDENT_DB_NAME ? { student: person } : { teacher: person };
    const courses = await Course.find({
      startTime: { $gte: startTime },
      endTime: { $lt: endTime },
      status: COURSE_STATUS_READY,
      ...appendQuery,
    });
    return this.cropAreaTime(spaceAreas, courses).map(v => ({ ...v, person }));
  }

  async getSpaceArea(query: any) {
    const { ctx } = this;
    const { SpaceRule, Course, Person } = ctx.model;
    const startTime: Date = new Date(query.startTime);
    const endTime: Date = new Date(query.endTime);
    const yearMonthDate: [number, number, number] = [ startTime.getFullYear(), startTime.getMonth(), startTime.getDate() ];
    const person = await Person.findById(query.person);
    if (!person) throw new ThrowError('人物已被删除');
    const isTeacher = person.kind === TEACHER_DB_NAME;
    // 查询时间有交集的规则
    // 1. 目标对象是学生 则拉取所有老师
    // 2. 时间区间需要有交集
    const spaceRules = await SpaceRule.findByTimeArea(startTime, endTime, isTeacher ? STUDENT_DB_NAME : TEACHER_DB_NAME);
    // 查询有交集的课程，进行裁剪
    const out: Array<any> = [];
    for (let i = 0; i < spaceRules.length; i++) {
      const spaceRule: SpaceRuleDocument = spaceRules[i];
      const { startTime, endTime } = spaceRule;
      startTime.setFullYear(...yearMonthDate);
      endTime.setFullYear(...yearMonthDate);
      const person: any = spaceRule.person;
      const courses01 = await Course.find({
        ...(person.kind === STUDENT_DB_NAME ? { student: person } : { teacher: person }),
        status: COURSE_STATUS_READY,
        $or: [
          { startTime: { $gte: startTime, $lt: endTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        ],
      });
      // 还要过滤个人请假的课程
      const courses02 = await Course.find({
        ...(person.kind === STUDENT_DB_NAME ? { student: person, studentStatus: COURSE_PERSON_STATUS_LEAVE } : { teacher: person, teacherStatus: COURSE_PERSON_STATUS_LEAVE }),
        status: COURSE_STATUS_NO_PASS,
        $or: [
          { startTime: { $gte: startTime, $lt: endTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        ],
      });
      const spaceAreas: Array<SpaceAreaDocument> = [{ startTime, endTime }];
      const temp: any = this.cropAreaTime(spaceAreas, [ ...courses01, ...courses02 ]).map(v => ({ ...v, person }));
      out.push(...temp);
    }
    // 保留交集
    return out.map(obj => {
      const st = Math.max(obj.startTime.getTime(), startTime.getTime());
      const et = Math.min(obj.endTime.getTime(), endTime.getTime());
      return {
        startTime: new Date(st),
        endTime: new Date(et),
        person: obj.person,
      };
    }).filter(obj => {
      return obj.startTime < obj.endTime;
    });
  }

}

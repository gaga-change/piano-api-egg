

import code from '../config/code';
import BaseController from '../code/BaseController';
import { CourseDocument } from '../model/Course';

export default class CourseController extends BaseController<CourseDocument> {

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
   */
  async findByPersonAndMonth() {
    const { ctx } = this;
    const { person, month } = ctx.query;
    ctx.assert(person && month, code.BadRequest, '参数不全');
    ctx.body = await ctx.service.courseService.findByPersonAndMonth(person, month);
  }

  /**
   * 获取当前周期内的 所有课程
   */
  async coursesActivateArea() {
    const { ctx } = this;
    const { teacher, student } = ctx.query;
    ctx.assert(teacher || student, 400, '参数异常');
    ctx.body = await ctx.service.courseService.coursesActivateArea(teacher, student);
  }

  /**
   * 获取某人某天未开始的课程
   */
  async findByPersonAndDay() {
    const { ctx } = this;
    const { person, date } = ctx.query;
    ctx.validate({ person: 'string', date: 'string' }, ctx.query);
    ctx.body = await ctx.service.courseService.findByPersonAndDay(person, date);

  }

  /**
   * 创建
   */
  async create() {
    const { ctx } = this;
    const { Course } = ctx.model;
    const body = ctx.request.body;
    // 字段校验
    await new Course(body).validate();
    ctx.body = await ctx.service.courseService.save(body);
  }


  /** 更新 */
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const body = ctx.request.body;
    const course = await this.baseService.show(id, { populate: false });
    course.set(body);
    await course.validate();
    ctx.body = await ctx.service.courseService.save(body, id);
  }
}

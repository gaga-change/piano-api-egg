import _ from 'lodash';
import BaseController from '../code/BaseController';
import { TakeCourseDocument } from '../model/TakeCourse';


export default class TakeCourseController extends BaseController<TakeCourseDocument> {

  constructor(ctx) {
    super('TakeCourse', {
      indexPopulate: [ 'teacher', 'student', 'course', 'classType', 'classTime', { path: 'order', populate: 'product' }],
      showPopulate: [ 'teacher', 'student', 'classTime' ],
    }, ctx);
  }

  async create(): Promise<void> {
    const { ctx } = this;
    ctx.body = await ctx.service.takeCourseService.create(ctx.request.body);
  }

  async update(): Promise<void> {
    const { ctx } = this;
    const { id } = ctx.params;
    const item = _.omit(ctx.request.body, [ 'cancel' ]);
    ctx.body = await this.baseService.update(id, item);
  }
}

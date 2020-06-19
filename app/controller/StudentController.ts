import BaseController from '../code/BaseController';
import { StudentDocument } from '../model/Student';

export default class StudentController extends BaseController<StudentDocument> {

  constructor(args) {
    super('Student', {
      defaultSort: { createdAt: -1 },
    }, args);
  }

  async update(): Promise<void> {
    const { ctx } = this;
    await super.update();
    ctx.body = await ctx.service.studentService.update(ctx.params.id, ctx.request.body);
  }
}

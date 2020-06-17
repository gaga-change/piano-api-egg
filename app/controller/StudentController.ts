import BaseController from '../BaseController';

export default class StudentController extends BaseController {

  constructor(args) {
    super('Student', {
      defaultSort: { createdAt: -1 },
      indexPopulate: [],
    }, args);
  }

  async update(): Promise<void> {
    const { ctx } = this;
    await super.update();
    ctx.body = await ctx.service.studentService.update(ctx.params.id, ctx.request.body);
  }
}

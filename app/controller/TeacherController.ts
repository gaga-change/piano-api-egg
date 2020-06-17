import BaseController from '../code/BaseController';

export default class TeacherController extends BaseController {

  constructor(args) {
    super('Teacher', {
      defaultSort: { createdAt: -1 },
      showPopulate: [{ path: 'type', select: 'name' }],
      indexPopulate: [{ path: 'type', select: 'name' }],
    }, args);
  }

  async update(): Promise<void> {
    const { ctx } = this;
    ctx.body = await ctx.service.teacherService.update(ctx.params.id, ctx.request.body);
  }
}

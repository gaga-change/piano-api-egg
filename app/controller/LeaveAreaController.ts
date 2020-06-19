import BaseController from '../code/BaseController';
import { LeaveAreaDocument } from '../model/LeaveArea';
import { pick } from 'lodash';


// @RequestMapping('leaveAreas')
export default class LeaveAreaController extends BaseController<LeaveAreaDocument> {
  constructor(ctx) {
    super('LeaveArea', {
      indexPopulate: [ 'course', 'person', 'adverse' ],
      showPopulate: [ 'course', 'person', 'adverse' ],
    }, ctx);
  }

  async create() {
    const { ctx } = this;
    ctx.body = await ctx.service.leaveAreaService.create();
  }

  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    // 只允许修改备注和状态
    const item = pick(ctx.request.body, [ 'remark', 'status' ]);
    ctx.body = await ctx.service.leaveAreaService.update(id, item);
  }
}

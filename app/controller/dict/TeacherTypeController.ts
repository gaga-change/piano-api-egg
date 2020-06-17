import BaseController from '../../code/BaseController';

export default class TeacherTypeController extends BaseController {
  constructor(args) {
    super('TeacherType', {
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

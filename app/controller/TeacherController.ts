import BaseController from '../BaseController';

export default class TeacherController extends BaseController {

  constructor(args) {
    super('Teacher', {
      defaultSort: { createdAt: -1 },
    }, args);
  }
}

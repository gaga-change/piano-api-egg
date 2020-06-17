import BaseController from '../../code/BaseController';

export default class ClassTypeController extends BaseController {

  constructor(args) {
    super('ClassType', {
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

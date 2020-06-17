import BaseController from '../../code/BaseController';

export default class ClassTimeController extends BaseController {

  constructor(args) {
    super('ClassTime', {
      duplicateKey: {
        time: '时间',
      },
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

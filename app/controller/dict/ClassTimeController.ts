import BaseController from '../../BaseController';

export default class ClassTimeController extends BaseController {

  constructor(args) {
    super('ClassTime', {
      duplicateKey: {
        time: '时间',
      },
    }, args);
  }
}

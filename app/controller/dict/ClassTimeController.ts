import BaseController from '../../code/BaseController';
import { ClassTimeDocument } from '../../model/ClassTime';

export default class ClassTimeController extends BaseController<ClassTimeDocument> {

  constructor(args) {
    super('ClassTime', {
      duplicateKey: {
        time: '时间',
      },
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

import BaseController from '../../code/BaseController';
import { ClassTypeDocument } from '../../model/ClassType';

export default class ClassTypeController extends BaseController<ClassTypeDocument> {

  constructor(args) {
    super('ClassType', {
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

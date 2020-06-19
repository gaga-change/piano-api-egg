import BaseController from '../../code/BaseController';
import { TeacherTypeDocument } from '../../model/TeacherType';

export default class TeacherTypeController extends BaseController<TeacherTypeDocument> {
  constructor(args) {
    super('TeacherType', {
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

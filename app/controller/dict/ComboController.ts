import BaseController from '../../code/BaseController';
import { ComboDocument } from '../../model/Combo';

export default class ComboController extends BaseController<ComboDocument> {

  constructor(args) {
    super('Combo', {
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

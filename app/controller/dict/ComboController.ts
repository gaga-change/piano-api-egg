import BaseController from '../../BaseController';

export default class ComboController extends BaseController {

  constructor(args) {
    super('Combo', {
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

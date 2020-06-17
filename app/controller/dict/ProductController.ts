import BaseController from '../../code/BaseController';

export default class ProductController extends BaseController {

  constructor(args) {
    super('Product', {
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

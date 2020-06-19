import BaseController from '../../code/BaseController';
import { ProductDocument } from '../../model/Product';

export default class ProductController extends BaseController<ProductDocument> {

  constructor(args) {
    super('Product', {
      defaultSort: { disabled: 1, createdAt: -1 },
    }, args);
  }
}

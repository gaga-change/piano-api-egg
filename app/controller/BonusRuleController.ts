import BaseController from '../code/BaseController';
import { BonusRuleDocument } from '../model/BonusRule';


export default class BonusRuleController extends BaseController<BonusRuleDocument> {
  constructor(ctx) {
    super('BonusRule', {
      defaultSort: { disabled: 1, createdAt: -1 },
      indexPopulate: [ 'teacherType', 'classTime' ],
    }, ctx);
  }
}

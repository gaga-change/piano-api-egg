import BaseService from '../code/BaseService';
import { ClassTimeDocument } from '../model/ClassTime';


export default class ClassTimeService extends BaseService<ClassTimeDocument> {
  constructor(ctx) {
    super('ClassTime', {}, ctx);
  }
}

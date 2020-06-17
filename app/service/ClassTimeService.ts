import { Service } from 'egg';
import { ClassTimeDocument } from '../model/ClassTime';
import ThrowError from '../tools/ThrowError';


export default class ClassTimeService extends Service {
  /**
   * 课时保存 校验分钟是否重复
   * @param classTime 课时
   */
  public async save(classTime: ClassTimeDocument): Promise<ClassTimeDocument> {
    const { ctx } = this;
    const { session } = ctx.state;
    const options = session ? { session } : {};
    const { ClassTime } = ctx.model;
    await classTime.save(options);
    const findTimeLen = await ClassTime.find({ time: classTime.time }, undefined, options);
    if (findTimeLen.length > 1) {
      throw new ThrowError(`${classTime.time}分钟的配置已存在，请勿重复添加！`);
    }
    return classTime;
  }
}

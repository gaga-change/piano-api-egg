import { Service } from 'egg';
import { PERSON_STATUS_READY } from '../config/const';

export default class DashboardService extends Service {

  /**
   * 获取老师&学生 准备状态的数量
   */
  public async readyNum(): Promise<{teacherReadyNum: number; studentReadyNum: number}> {
    const { Teacher, Student } = this.app.model;
    return {
      teacherReadyNum: await Teacher.countDocuments({ status: PERSON_STATUS_READY }),
      studentReadyNum: await Student.countDocuments({ status: PERSON_STATUS_READY }),
    };
  }
}

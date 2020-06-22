import moment from 'moment';
import axios from 'axios';
import { TEACHER_TYPE, STUDENT_TYPE } from '../../tools/wxTools';
import { TakeCourseDocument } from '../../model/TakeCourse';
import { TeacherDocument } from '../../model/Teacher';
import { StudentDocument } from '../../model/Student';
import { Service } from 'egg';
import { PersonDocument } from '../../model/Person';
import { TEACHER_DB_NAME } from '../../config/dbName';

export default class PushMsg extends Service {

  private async wxPushMsgService(person: PersonDocument, templateId: string, options: {
    url?: string;
    first: string;
    keyword1: string;
    keyword2: string;
    remark: string;
  }) {
    const { wxTokenService } = this.ctx.service;
    const token = await wxTokenService.getToken(person.kind === TEACHER_DB_NAME ? TEACHER_TYPE : STUDENT_TYPE);
    if (person.openid) {
      await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`, {
        touser: person.openid,
        template_id: templateId,
        url: options.url,
        data: {
          first: {
            value: options.first,
          },
          keyword1: {
            value: options.keyword1,
          },
          keyword2: {
            value: options.keyword2,
          },
          remark: {
            value: options.remark,
          },

        },
      });
    }
  }

  /**
   * 通知老师抢课
   * @param teacher 老师
   * @param student 学生
   * @param takeCourse 抢课信息
   */
  public async teacherTakeCourse(teacher: TeacherDocument, student: StudentDocument, takeCourse: TakeCourseDocument) {
    const classTime: any = takeCourse.classTime;
    await this.wxPushMsgService(teacher, 'DVy-G8MPZtlZkToOeZFcsX6DmM0pjEUNMR-iBKT7RfA', {
      url: `http://page.teacher.wx.carry.junn.top/teacher/TakeCourse?id=${takeCourse._id}`,
      first: '抢课通知！',
      keyword1: '抢课通知',
      keyword2: `开始时间：${moment(takeCourse.startTime).format('YYYY-MM-DD HH:mm')}，课时：${classTime.time}分钟，学生：${student.name}`,
      remark: '点击进入抢课页面！',
    });
  }

  /**
   * 老师注册成功通知
   * @param teacher 老师
   */
  public async teacherRegisterSuccess(teacher: TeacherDocument) {
    await this.wxPushMsgService(teacher, 'P2InMFm7yqOiij-9Rmzt7Qdg3FiUcwbaF3tTHu5qL-o', {
      first: '恭喜您成为四分音艺术教师的一员！',
      keyword1: teacher.name,
      keyword2: teacher.phone,
      remark: '发送消息【空闲时段】，设置您的空闲时间段',
    });
  }


  /**
   * 学生注册成功通知
   * @param student 学生
   */
  public async studentRegisterSuccess(student: StudentDocument) {
    await this.wxPushMsgService(student, 'blQsIsRXXa4V8bltStYNPQZBo-tXqDpsMNRDcvH0mlI', {
      first: '恭喜您成为Carry陪练的会员！',
      keyword1: student.name,
      keyword2: student.phone,
      remark: '发送消息【空闲时段】，设置您的空闲时间段',
    });
  }

  /**
   * 通知管理员 教师资料提交
   * @param teacher 老师
   */
  public async informTeacherRegister(teacher: TeacherDocument) {
    const { Person } = this.ctx.model;
    const personList = await Person.find({ isService: true });
    for (let i = 0; i < personList.length; i++) {
      const person = personList[i];
      await this.wxPushMsgService(person, 'yMD7XbC7p4ODXzJ605lL3oZhKICAskFSalrCbNanKGo', {
        first: '有新的教师注册，请及时受理！',
        keyword1: teacher.name,
        keyword2: teacher.phone,
        remark: '请到后台管理中审批',
      });
    }
  }

  /**
   * 通知管理员学生资料提交
   * @param student 学生
   */
  public async informStudentRegister(student: StudentDocument) {
    const { Person } = this.ctx.model;
    const personList = await Person.find({ isService: true });
    for (let i = 0; i < personList.length; i++) {
      const person = personList[i];
      await this.wxPushMsgService(person, 'l5w82zR0G7PyMz5NY0fKn0Lz6nRJdv3kpZedJnSJYeQ', {
        first: '有新的学生注册，请及时受理！',
        keyword1: student.name,
        keyword2: student.phone,
        remark: '请到后台管理中审批',
      });
    }
  }
}

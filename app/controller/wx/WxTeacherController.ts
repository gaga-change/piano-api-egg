import axios from 'axios';
import { Controller } from 'egg';
import ThrowError from '../../tools/ThrowError';
import { PERSON_STATUS_READY } from '../../config/const';
import { TeacherDocument } from '../../model/Teacher';
import { STUDENT_TYPE, TEACHER_TYPE } from '../../tools/wxTools';

export default class WxTeacherController extends Controller {

  /**
   * 抢课接口
   */
  async takeCourse() {
    const { ctx } = this;
    const { TakeCourse, Course } = ctx.model;
    const { user, session } = ctx.state;
    const teacherId = user._id;
    const { takeCourseId } = ctx.request.body;
    const takeCourse = await TakeCourse.findById(takeCourseId, undefined, { session }).populate('classTime');
    if (!takeCourse) throw new ThrowError('抢课已被删除');
    const oldData = await TakeCourse.findByIdAndUpdate(takeCourseId, { teacher: teacherId }, { session });
    if (!oldData) throw new ThrowError('抢课已删除！');
    if (oldData.cancel) throw new ThrowError('抢课已取消！');
    if (oldData.cancel) throw new ThrowError('抢课已取消！');
    const classTime: any = takeCourse.classTime;
    const course = new Course({
      startTime: takeCourse.startTime,
      endTime: new Date(new Date(takeCourse.startTime).getTime() + classTime.time * 60 * 1000),
      teacher: teacherId,
      student: takeCourse.student,
      classType: takeCourse.classType,
      classTime: takeCourse.classTime,
      order: takeCourse.order,
    });
    await course.save({ session });
    ctx.body = null;
  }

  /**
   * 手机端老师注册
   */
  async register() {
    const { ctx } = this;
    const { Teacher } = ctx.model;
    const { body } = ctx.request;
    body.status = PERSON_STATUS_READY; // 待审核
    body.openid = ctx.openid;
    if (ctx.state.user) body._id = ctx.state.user._id;
    let teacher;
    if (body._id) {
      const _id = body._id;
      teacher = await Teacher.findByIdAndUpdate(_id, body, { new: true });
    } else {
      teacher = new Teacher(body);
      await teacher.save();
    }
    setImmediate(async () => {
      if (teacher) {
        await ctx.service.wx.pushMsg.informTeacherRegister(teacher);
      }
    });
    ctx.body = teacher;
  }


  async getSelfQrcode() {
    const { ctx } = this;
    const teacher: TeacherDocument = ctx.state.user;
    if (!teacher.qrcodeTeacherTicket) {
      const token = await ctx.service.wxTokenService.getToken(TEACHER_TYPE);
      const res: { data: { ticket: string; url: string } } = await axios.post(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${token}`, {
        action_name: 'QR_LIMIT_SCENE',
        action_info: { scene: { scene_id: 0 } },
      });
      teacher.qrcodeTeacherTicket = res.data.ticket;
      await teacher.save();
    }
    if (!teacher.qrcodeStudentTicket) {
      const token = await ctx.service.wxTokenService.getToken(STUDENT_TYPE);
      const res: { data: { ticket: string; url: string } } = await axios.post(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${token}`, {
        action_name: 'QR_LIMIT_SCENE',
        action_info: { scene: { scene_id: 0 } },
      });
      teacher.qrcodeStudentTicket = res.data.ticket;
      await teacher.save();
    }
    ctx.body = {
      teacher: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${teacher.qrcodeTeacherTicket}`,
      student:
        `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${teacher.qrcodeStudentTicket}`,
    };
  }
}

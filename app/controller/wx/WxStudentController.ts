
import axios from 'axios';
import { Controller } from 'egg';
import { PERSON_STATUS_READY } from '../../config/const';
import { StudentDocument } from '../../model/Student';
import { STUDENT_TYPE } from '../../tools/wxTools';

export default class WxStudentController extends Controller {

  /**
   * 手机端学生注册
   */
  async register() {
    const { ctx } = this;
    const { Student } = ctx.model;
    const { body } = ctx.request;
    body.status = PERSON_STATUS_READY; // 待审核
    body.openid = ctx.openid;
    if (ctx.state.user) body._id = ctx.state.user._id;
    let student: StudentDocument | null;
    if (body._id) { // 有id为编辑
      const _id = body._id;
      student = await Student.findByIdAndUpdate(_id, body, { new: true });
    } else { // 没有则为创建
      student = new Student(body);
      await student.save();
    }
    setImmediate(async () => {
      if (student) {
        await ctx.service.wx.pushMsg.informStudentRegister(student);
      }
    });
    ctx.body = student;
  }

  async getSelfQrcode() {
    const { ctx } = this;
    const student: StudentDocument = ctx.state.user;
    if (!student.qrcodeStudentTicket) {
      const token = await ctx.service.wxTokenService.getToken(STUDENT_TYPE);
      const res: { data: { ticket: string; url: string } } = await axios.post(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${token}`, {
        action_name: 'QR_LIMIT_SCENE',
        action_info: { scene: { scene_id: 1 } },
      });
      student.qrcodeStudentTicket = res.data.ticket;
      await student.save();
    }
    ctx.body = {
      student:
        `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${student.qrcodeStudentTicket}`,
    };
  }
}

import convert from 'xml-js';
import code from '../../config/code';
import axios from 'axios';
import { personToTeacherOrStudent } from '../../tools/person';
import { COURSE_STATUS_READY } from '../../config/const';
import { Controller } from 'egg';
import { STUDENT_MENU, TEACHER_MENU } from '../../config/menu';
import { getAppidAndsecret, STUDENT_TYPE, TEACHER_TYPE } from '../../tools/wxTools';

export default class WxController extends Controller {

  /**
   * 获取未开始的课程
   */
  async getReadyCourses() {
    const { ctx } = this;
    const { Course } = ctx.model;
    const person = ctx.state.user;
    ctx.body = await Course.findByActivateArea(personToTeacherOrStudent(person), { status: COURSE_STATUS_READY });
  }

  /**
   * 微信公众号菜单创建
   */
  async createMenu() {
    const { ctx } = this;
    const teacherToken = await ctx.service.wxTokenService.getToken(TEACHER_TYPE);
    const studentToken = await ctx.service.wxTokenService.getToken(STUDENT_TYPE);
    const res1 = await axios.post(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${teacherToken}`, TEACHER_MENU);
    const res2 = await axios.post(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${studentToken}`, STUDENT_MENU);
    ctx.body = {
      teacher: res1.data,
      student: res2.data,
    };
  }

  /** 同步微信标签 */
  async wxTagSync() {
    const { ctx } = this;
    const { type } = ctx.params;
    ctx.body = await ctx.service.wxTokenService.syncTags(type);
  }

  /** 微信登录 */
  async wxLogin() {
    const { ctx } = this;
    const { Person } = ctx.model;
    const { isTeacher, openid } = ctx;
    // 已登录，直接返回信息
    if (openid) {
      ctx.body = {
        openid,
        user: await Person.findOne({ openid }),
      };
    } else {
      const { appid, secret } = getAppidAndsecret(isTeacher);
      const { code: wxCode } = ctx.query;
      ctx.assert(wxCode, code.BadRequest, '需要传递参数 code');
      const res = await axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
        params: {
          appid,
          secret,
          code: wxCode,
          grant_type: 'authorization_code',
        },
      });
      if (!res.data.openid) { // 报错返回报错内容
        ctx.status = code.BadRequest;
        ctx.body = res.data;
      } else {
        ctx.session.openid = res.data.openid;
        const user = await Person.findOne({ openid: res.data.openid });
        ctx.body = {
          openid: res.data.openid,
          user,
        };
      }
    }
  }

  /** 获取 openid */
  async wxAccount() {
    const { ctx } = this;
    ctx.body = {
      openid: ctx.openid,
      user: ctx.state.user,
    };
  }

  /** 微信服务 */
  async wxServer() {
    const { ctx } = this;
    // var token="weixin";
    // var signature = ctx.query.signature;
    // var timestamp = ctx.query.timestamp;
    // var nonce     = ctx.query.nonce;
    console.log('微信服务');
    ctx.body = ctx.query.echostr;

  }

  /** 微信服务 */
  async wxPostServer() {
    const { ctx } = this;
    const { Person, Share } = ctx.model;
    const res: any = convert.xml2js(ctx.request.body, { compact: true });
    const event: string | undefined = res.xml.Event && res.xml.Event._cdata;
    const msgType: string = res.xml.MsgType._cdata;
    const fromUserName: string = res.xml.FromUserName._cdata;
    const ticket: string | undefined = res.xml.Ticket && res.xml.Ticket._cdata;
    if (msgType === 'event' && event === 'subscribe' && ticket) { // 订阅事件
      const person = await Person.findOne({ $or: [{ qrcodeTeacherTicket: ticket }, { qrcodeStudentTicket: ticket }] }); // 分享的人
      if (person && person.openid !== fromUserName) { // 确定分享的人还在 并且不是本人
        const exist = await Share.findOne({ shareOpenid: person.openid, subscribeOpenid: fromUserName });
        if (!exist) { // 确定没有重复，防止取消后重写关注
          await new Share({
            shareOpenid: person.openid,
            subscribeOpenid: fromUserName,
            type: person.qrcodeTeacherTicket === ticket ? 0 : 1,
          }).save();
        }
      }
    } else if (msgType === 'event' && event === 'unsubscribe') { // 取消订阅
      await Share.deleteMany({ subscribeOpenid: fromUserName }); // 删除原有分享关系
    }
    ctx.body = '';
  }
}

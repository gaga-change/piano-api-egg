import * as convert from 'xml-js';
import code from '../../config/code';
import axios from 'axios';
import { personToTeacherOrStudent } from '../../tools/person';
import { COURSE_STATUS_READY } from '../../config/const';
import { Controller } from 'egg';
import { getStudentMenu, getTeacherMenu } from '../../config/menu';
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
    const res1 = await axios.post(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${teacherToken}`, getTeacherMenu());
    const res2 = await axios.post(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${studentToken}`, getStudentMenu());
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
    console.log(ctx.request.body);
    const res: any = convert.xml2js(ctx.request.body, { compact: true });
    const event: string | undefined = res.xml.Event && res.xml.Event._cdata;
    const content: string | undefined = res.xml.Content && res.xml.Content._cdata;
    const toUserName: string | undefined = res.xml.ToUserName && res.xml.ToUserName._cdata;
    const fromUserName: string = res.xml.FromUserName && res.xml.FromUserName._cdata;
    const msgType: string = res.xml.MsgType._cdata;
    const ticket: string | undefined = res.xml.Ticket && res.xml.Ticket._cdata;
    if (msgType === 'text' && content) {
      console.log('### content:', content);
      if (content.indexOf('空闲时段') > -1) {
        console.log(content);
        // eslint-disable-next-line no-return-assign
        ctx.set('Content-Type', 'text/xml');
        ctx.body = `
      <xml>
  <ToUserName><![CDATA[${fromUserName}]]></ToUserName>
  <FromUserName><![CDATA[${toUserName}]]></FromUserName>
  <CreateTime>${Date.now()}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[发送消息给公众号，消息内容为空闲时间段，当天有多个时间段则用空格分开，设置成功后会发消息给您，例如发送消息给公众号：
周一 18:00-22:00
周二 18:00-22:00 
周三 18:00-22:00 
周四 
周五 18:05-22:10 
周六 07:00-12:00 13:00-17:00 18:00-22:00
周日 07:00-12:00 13:00-17:00 18:00-22:00]]></Content>
</xml>`;
        console.log(ctx.body);
      }
    } else if (msgType === 'event' && event === 'subscribe' && ticket) { // 订阅事件
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
    if (!ctx.body) {
      ctx.body = '';
    }
  }
}

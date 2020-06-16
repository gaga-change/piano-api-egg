import { Service } from 'egg';
import axios from 'axios';
import myAssert from '../tools/myAssert';
import { getAppidAndsecret } from '../tools/wxTools';

export default class WxTokenService extends Service {

  /**
   * 获取微信 token
   * @param type 类型
   */
  public async getToken(type: string): Promise<string> {
    const { WxCacheToken } = this.ctx.model;
    let wxCacheToken = await WxCacheToken.findOne({ type });
    if (wxCacheToken === null) { // 若无，则建立
      wxCacheToken = new WxCacheToken({ type });
    }
    if (wxCacheToken.token && (Date.now() - wxCacheToken.updatedAt.getTime()) < 1000 * 60 * 100) {
      console.log('读取缓存 wxCacheToken - ');
    } else { // 超时
      console.log('token缓存失效或未读取，重新获取', new Date().toLocaleString());
      const { appid, secret } = getAppidAndsecret(type);
      const { data } = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`);
      myAssert(data.access_token, data.errmsg || '获取token报错', 500);
      wxCacheToken.token = data.access_token;
      await wxCacheToken.save();
    }
    return wxCacheToken.token;
  }

  public async getTags(type: string) {
    const { WxCacheTags } = this.ctx.model;
    let wxCacheTags = await WxCacheTags.findOne({ type });
    const token = await this.getToken(type);
    if (wxCacheTags === null) { // 不存在则获取 保存
      const res = await axios.get(`https://api.weixin.qq.com/cgi-bin/tags/get?access_token=${token}`);
      wxCacheTags = new WxCacheTags({ type, tags: res.data });
      await wxCacheTags.save();
    }
    return wxCacheTags.tags;
  }

  public async syncTags(type: string) {
    const { WxCacheTags } = this.ctx.model;
    let wxCacheTags = await WxCacheTags.findOne({ type });
    const token = await this.getToken(type);
    const res = await axios.get(`https://api.weixin.qq.com/cgi-bin/tags/get?access_token=${token}`);
    const tags = res.data.tags;
    if (wxCacheTags === null) {
      console.log('新建标签缓存');
      wxCacheTags = new WxCacheTags({ type, tags });
    } else {
      console.log('标签缓存更新');
      wxCacheTags.tags = tags;
    }
    await wxCacheTags.save();
    return wxCacheTags.tags;
  }

  public async getUserByTag(type: string, tagid: any) {
    const token = await this.getToken(type);
    const res = await axios.post(`https://api.weixin.qq.com/cgi-bin/user/tag/get?access_token=${token}`, { tagid });
    return res.data.data.openid;
  }

  public async getUserByTagName(type: string, tagName: string) {
    const tags = await this.getTags(type);
    const tag = tags.find((v: { name: string }) => v.name === tagName);
    if (!tag) {
      console.log('无此标签 ', tagName);
      return [];
    }
    return await this.getUserByTag(type, tag.id);

  }

}

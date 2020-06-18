import { Service } from 'egg';
import * as localEnums from '../config/enums';

interface Enums {
  [key: string]: Map<number, string>;
}

export default class EnumService extends Service {

  /**
   * 获取所有枚举
   */
  public async total() {
    const { ctx } = this;
    const { Dict } = ctx.model;
    // 名称格式转换 AA_BB_CC -> aaBbCc
    const turn = (str: string) => {
      str = str.toLowerCase();
      return str.replace(/_(\w)/g, (_s: string, c: string) => {
        return c.toUpperCase();
      });
    };
    // 本地枚举获取
    const locals = Object.keys(localEnums as Enums).map(key => {
      const map = (localEnums as Enums)[key];
      return {
        name: turn(key),
        keyValue: [ ...map.keys() ].map(k => ({ value: k, name: map.get(k) })),
      };
    });
    // 字典获取
    const dict = await Dict.aggregate([
      {
        $match: { disabled: false },
      },
      {
        $group: {
          _id: '$kind',
          keyValue: { $push: { value: '$_id', name: '$name', time: '$time' } },
        },
      },
    ])
      .project({ name: '$_id', _id: 0, keyValue: 1 });
    return [
      ...locals,
      ...dict,
    ];
  }
}

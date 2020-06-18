import BaseService from '../code/BaseService';
import { PERSON_DB_NAME } from '../config/dbName';
import { pageable } from '../tools/pageable';


export default class ShareService extends BaseService {
  constructor(ctx) {
    super('Share', {}, ctx);
  }


  async index(query: any): Promise<{ total: any; list: any }> {
    const { Share } = this.app.model;
    const { skip, limit, params } = pageable(query, this.Model, { fuzzy: false });
    const shareList = await Share.aggregate([
      {
        $lookup: {
          from: PERSON_DB_NAME,
          localField: 'shareOpenid',
          foreignField: 'openid',
          as: 'shareUser',
        },
      },
      {
        $lookup: {
          from: PERSON_DB_NAME,
          localField: 'subscribeOpenid',
          foreignField: 'openid',
          as: 'subscribeUser',
        },
      },
      {
        $match: params,
      },
      {
        $addFields: {
          shareUser: { $arrayElemAt: [ '$shareUser', 0 ] },
          subscribeUser: { $arrayElemAt: [ '$subscribeUser', 0 ] },
        },
      },
    ]).limit(limit).skip(skip);
    const shareListCount = await Share.aggregate([
      {
        $match: params,
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const total = shareListCount && shareListCount[0] && shareListCount[0].count || 0;
    return {
      total,
      list: shareList,
    };
  }
}

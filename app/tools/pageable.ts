
import { Model } from 'mongoose';

interface PageAbleOptions {
  fuzzy: boolean; // 是否模糊搜索
}

/**
 * 列表请求参数过滤
 * @param query 请求参数
 * @param model Model
 * @param options 参数
 */
export const pageable = (query: any, model: Model<any>, options: PageAbleOptions = { fuzzy: true }): {skip: number; limit: number; params: any} => {
  const pageSize = Number(query.pageSize) || 20;
  const page = Number(query.pageNum) || 1;
  const params = { ...query };
  delete params.pageSize;
  delete params.pageNum;
  if (options.fuzzy) {
    Object.keys(params).forEach(key => {
      if (model.schema.obj[key] && model.schema.obj[key].type === String) {
        params[key] = new RegExp(params[key], 'i');
      }
    });
  }
  return {
    params,
    skip: (page - 1) * pageSize,
    limit: pageSize,
  };
};

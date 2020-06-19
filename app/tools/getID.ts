import { Document } from 'mongoose';
import ThrowError from './ThrowError';

export const getId = (item: Document | string | null | undefined): string => {
  if (item === null || item === undefined) {
    throw new ThrowError('资源被删除');
  } else if (typeof item === 'object') {
    return item._id;
  } else {
    return item;
  }
};

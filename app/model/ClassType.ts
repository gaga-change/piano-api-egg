
import { Model, Schema } from 'mongoose';
import { CLASS_TYPE_DB_NAME } from '../config/dbName';
import Dict, { DictDocument } from './Dict';

export interface ClassTypeDocument extends DictDocument {
}
export default (): Model<ClassTypeDocument> => {

  const schema = new Schema({

  }, {
    timestamps: true,
    discriminatorKey: 'kind',
  });
  return Dict().discriminator<ClassTypeDocument>('ClassType', schema, CLASS_TYPE_DB_NAME);
};

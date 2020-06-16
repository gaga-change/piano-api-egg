
import { Model, Schema } from 'mongoose';
import { COMBO_DB_NAME } from '../config/dbName';
import Dict, { DictDocument } from './Dict';

export interface ComboDocument extends DictDocument {
}

export default (): Model<ComboDocument> => {
  const schema = new Schema({
    time: { type: Number, required: true },
  }, {
    timestamps: true,
    discriminatorKey: 'kind',
  });

  return Dict().discriminator<ComboDocument>('Combo', schema, COMBO_DB_NAME);
};

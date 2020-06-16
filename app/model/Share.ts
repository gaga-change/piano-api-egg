
import { Document, Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { SHARE_TYPE_MAP } from '../config/enums';

export interface ShareDocument extends Document {
  shareOpenid: string;
  subscribeOpenid: string;
  type: number;
}

export default (): Model<ShareDocument> => {

  const schema = new Schema({
    shareOpenid: { type: String, required: true }, // 分享者
    subscribeOpenid: { type: String, required: true }, // 关注者
    type: { type: Number, default: 0, enum: [ ...SHARE_TYPE_MAP.keys() ] },
  }, {
    timestamps: true,
  });

  return mongoose.model<ShareDocument>('Share', schema, 'piano_share');
};

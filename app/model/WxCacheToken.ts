
import { Document, Model, Schema } from 'mongoose';
import * as mongoose from "mongoose";
import { SchemaTimestampsDocument } from '../../typings';

interface log {
  time: Date
}

export interface WxCacheTokenDocument extends  Document, SchemaTimestampsDocument{
  type: string
  token: string
  log: Array<log>
}

export default (): Model<WxCacheTokenDocument> => {

  const schema = new Schema({
    type: { type: String },
    token: { type: String },
    log: [
      {
        time: { type: Date },
      },
    ]
  }, {
    timestamps: true,
  })

  return mongoose.model<WxCacheTokenDocument>('WxCacheToken', schema, 'piano_wx_cache_token');
};


import { Document, Model, Schema } from 'mongoose';
import * as mongoose from "mongoose";

interface tag {
  id: number
  name: string
  count: number
}
interface log {
  time: Date
}

export interface WxCacheTagsDocument extends Document{
  type: string
  tags: Array<tag>
  log: Array<log>
}

export default (): Model<WxCacheTagsDocument> => {

  const schema = new Schema({
    type: { type: String },
    tags: [{
      id: { type: Number },
      name: { type: String },
      count: { type: Number }
    }],
    log: [
      {
        time: { type: Date },
      },
    ]
  }, {
    timestamps: true,
  })

  return  mongoose.model<WxCacheTagsDocument>('WxCacheTags', schema, 'piano_wx_cache_tags');
};

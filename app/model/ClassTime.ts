
import { Model, Schema } from 'mongoose';
import {CLASS_TIME_DB_NAME} from "../config/dbName";
import Dict, {DictDocument} from "./Dict";

export interface ClassTimeDocument extends DictDocument {
  time: number
}

export default (): Model<ClassTimeDocument> => {
  const schema = new Schema({
    time: {type: Number, required: true}
  }, {
    timestamps: true,
    discriminatorKey: 'kind'
  })

  return Dict.discriminator<ClassTimeDocument>('ClassTime', schema, CLASS_TIME_DB_NAME)
}

import { Model, Schema } from 'mongoose';
import {CLASS_TIME_DB_NAME} from "../config/dbName";
import Dict, {DictDocument} from "./Dict";

export interface ClassTimeDocument extends DictDocument {
  time: number
}
const schema = new Schema({
  time: {type: Number, required: true}
}, {
  timestamps: true,
  discriminatorKey: 'kind'
})

const model = Dict().discriminator<ClassTimeDocument>('ClassTime', schema, CLASS_TIME_DB_NAME)

export default (): Model<ClassTimeDocument> => {
  return model
}
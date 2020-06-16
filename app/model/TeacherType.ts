
import { Model, Schema } from 'mongoose';
import {TEACHER_TYPE_DB_NAME} from "../config/dbName";
import Dict, {DictDocument} from "./Dict";

export interface TeacherTypeDocument extends DictDocument {
}

export default (): Model<TeacherTypeDocument> => {
  const schema = new Schema({

  }, {
    timestamps: true,
    discriminatorKey: 'kind'
  })

  return Dict().discriminator<TeacherTypeDocument>('TeacherType', schema, TEACHER_TYPE_DB_NAME)
};

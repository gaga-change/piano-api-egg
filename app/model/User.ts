
import { Document, Model, Schema } from 'mongoose';
import * as mongoose from "mongoose";
export interface UserDocument extends Document{
  username: string
  password: string
}

export default (): Model<UserDocument> => {

  const schema = new Schema({
    username: { type: String, },
    password: { type: String, },

  },{
    timestamps: true,
  })

  return mongoose.model<UserDocument>('User', schema, 'piano_user');
};

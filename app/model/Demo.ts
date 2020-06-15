// import { Document, Model, Schema } from 'mongoose';
// import * as mongoose from "mongoose";
//
// export interface DemoDocument extends Document {
//   name: string;
// }
//
// export default (): Model<DemoDocument> => {
//
//   const EnumSchema = new Schema({
//     name: { type: String, default: '', trim: true },
//   }, {
//     timestamps: true,
//   });
//
//   return mongoose.model<DemoDocument>('test', EnumSchema, 'test');
// };


import { Document, Model, Schema } from 'mongoose';
import * as mongoose from "mongoose";

export default (): Model<any> => {

  const EnumSchema = new Schema({
    name: { type: String, default: '', trim: true },
  }, {
    timestamps: true,
  });

  return mongoose.model<any>('test', EnumSchema, 'test');
};

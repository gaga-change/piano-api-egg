import 'egg';
import {IModel, MongooseModels, MongooseSingleton} from 'egg';

export interface SchemaTimestampsDocument {
  createdAt: Date;
  updatedAt: Date;
}

declare module 'egg' {
  interface Context {
    model: IModel;
    isTeacher: boolean;
    openid: string | null
  }
  interface Application {
    model: IModel;
  }
}
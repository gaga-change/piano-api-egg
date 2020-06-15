import 'egg';
import { IModel } from 'egg';

declare module 'egg' {
  interface Context {
    model: IModel;
  }
}
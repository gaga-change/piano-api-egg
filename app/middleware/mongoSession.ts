import * as mongoose from 'mongoose';
import { Context } from 'egg';


export default function mongoSession(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    ctx.state.session = session;
    await next()
      .then(async () => {
        await session.commitTransaction();
      })
      .catch(async error => {
        await session.abortTransaction();
        error.status = 400;
        error.expose = true;
        return Promise.reject(error);
      });
    session.endSession();
  };
}

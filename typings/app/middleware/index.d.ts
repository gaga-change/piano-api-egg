// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCheckAuth from '../../../app/middleware/checkAuth';
import ExportMongoSession from '../../../app/middleware/mongoSession';
import ExportWxAuth from '../../../app/middleware/wxAuth';

declare module 'egg' {
  interface IMiddleware {
    checkAuth: typeof ExportCheckAuth;
    mongoSession: typeof ExportMongoSession;
    wxAuth: typeof ExportWxAuth;
  }
}

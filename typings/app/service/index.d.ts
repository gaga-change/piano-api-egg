// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAuthService from '../../../app/service/AuthService';
import ExportClassTimeService from '../../../app/service/ClassTimeService';
import ExportWxTokenService from '../../../app/service/WxTokenService';

declare module 'egg' {
  interface IService {
    authService: AutoInstanceType<typeof ExportAuthService>;
    classTimeService: AutoInstanceType<typeof ExportClassTimeService>;
    wxTokenService: AutoInstanceType<typeof ExportWxTokenService>;
  }
}

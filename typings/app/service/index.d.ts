// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAuthService from '../../../app/service/AuthService';
import ExportClassTimeService from '../../../app/service/ClassTimeService';
import ExportCourseService from '../../../app/service/CourseService';
import ExportDashboardService from '../../../app/service/DashboardService';
import ExportEnumService from '../../../app/service/EnumService';
import ExportLeaveAreaService from '../../../app/service/LeaveAreaService';
import ExportOrderService from '../../../app/service/OrderService';
import ExportPersonService from '../../../app/service/PersonService';
import ExportShareService from '../../../app/service/ShareService';
import ExportSpaceRuleService from '../../../app/service/SpaceRuleService';
import ExportStudentService from '../../../app/service/StudentService';
import ExportTakeCourseService from '../../../app/service/TakeCourseService';
import ExportTeacherService from '../../../app/service/TeacherService';
import ExportWxTokenService from '../../../app/service/WxTokenService';
import ExportWxPushMsg from '../../../app/service/wx/PushMsg';

declare module 'egg' {
  interface IService {
    authService: AutoInstanceType<typeof ExportAuthService>;
    classTimeService: AutoInstanceType<typeof ExportClassTimeService>;
    courseService: AutoInstanceType<typeof ExportCourseService>;
    dashboardService: AutoInstanceType<typeof ExportDashboardService>;
    enumService: AutoInstanceType<typeof ExportEnumService>;
    leaveAreaService: AutoInstanceType<typeof ExportLeaveAreaService>;
    orderService: AutoInstanceType<typeof ExportOrderService>;
    personService: AutoInstanceType<typeof ExportPersonService>;
    shareService: AutoInstanceType<typeof ExportShareService>;
    spaceRuleService: AutoInstanceType<typeof ExportSpaceRuleService>;
    studentService: AutoInstanceType<typeof ExportStudentService>;
    takeCourseService: AutoInstanceType<typeof ExportTakeCourseService>;
    teacherService: AutoInstanceType<typeof ExportTeacherService>;
    wxTokenService: AutoInstanceType<typeof ExportWxTokenService>;
    wx: {
      pushMsg: AutoInstanceType<typeof ExportWxPushMsg>;
    }
  }
}

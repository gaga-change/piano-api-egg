// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBonusRule from '../../../app/model/BonusRule';
import ExportClassTime from '../../../app/model/ClassTime';
import ExportClassType from '../../../app/model/ClassType';
import ExportCombo from '../../../app/model/Combo';
import ExportCourse from '../../../app/model/Course';
import ExportDict from '../../../app/model/Dict';
import ExportLeaveArea from '../../../app/model/LeaveArea';
import ExportOrder from '../../../app/model/Order';
import ExportPerson from '../../../app/model/Person';
import ExportProduct from '../../../app/model/Product';
import ExportShare from '../../../app/model/Share';
import ExportSpaceRule from '../../../app/model/SpaceRule';
import ExportStudent from '../../../app/model/Student';
import ExportTakeCourse from '../../../app/model/TakeCourse';
import ExportTeacher from '../../../app/model/Teacher';
import ExportTeacherType from '../../../app/model/TeacherType';
import ExportUser from '../../../app/model/User';
import ExportWxCacheTags from '../../../app/model/WxCacheTags';
import ExportWxCacheToken from '../../../app/model/WxCacheToken';

declare module 'egg' {
  interface IModel {
    BonusRule: ReturnType<typeof ExportBonusRule>;
    ClassTime: ReturnType<typeof ExportClassTime>;
    ClassType: ReturnType<typeof ExportClassType>;
    Combo: ReturnType<typeof ExportCombo>;
    Course: ReturnType<typeof ExportCourse>;
    Dict: ReturnType<typeof ExportDict>;
    LeaveArea: ReturnType<typeof ExportLeaveArea>;
    Order: ReturnType<typeof ExportOrder>;
    Person: ReturnType<typeof ExportPerson>;
    Product: ReturnType<typeof ExportProduct>;
    Share: ReturnType<typeof ExportShare>;
    SpaceRule: ReturnType<typeof ExportSpaceRule>;
    Student: ReturnType<typeof ExportStudent>;
    TakeCourse: ReturnType<typeof ExportTakeCourse>;
    Teacher: ReturnType<typeof ExportTeacher>;
    TeacherType: ReturnType<typeof ExportTeacherType>;
    User: ReturnType<typeof ExportUser>;
    WxCacheTags: ReturnType<typeof ExportWxCacheTags>;
    WxCacheToken: ReturnType<typeof ExportWxCacheToken>;
  }
}

// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthController from '../../../app/controller/AuthController';
import ExportBonusRuleController from '../../../app/controller/BonusRuleController';
import ExportCourseController from '../../../app/controller/CourseController';
import ExportDashboardController from '../../../app/controller/DashboardController';
import ExportEnumController from '../../../app/controller/EnumController';
import ExportHome from '../../../app/controller/home';
import ExportLeaveAreaController from '../../../app/controller/LeaveAreaController';
import ExportOrderController from '../../../app/controller/OrderController';
import ExportPersonController from '../../../app/controller/PersonController';
import ExportShareController from '../../../app/controller/ShareController';
import ExportSpaceRuleController from '../../../app/controller/SpaceRuleController';
import ExportStudentController from '../../../app/controller/StudentController';
import ExportTakeCourseController from '../../../app/controller/TakeCourseController';
import ExportTeacherController from '../../../app/controller/TeacherController';
import ExportDictClassTimeController from '../../../app/controller/dict/ClassTimeController';
import ExportDictClassTypeController from '../../../app/controller/dict/ClassTypeController';
import ExportDictComboController from '../../../app/controller/dict/ComboController';
import ExportDictProductController from '../../../app/controller/dict/ProductController';
import ExportDictTeacherTypeController from '../../../app/controller/dict/TeacherTypeController';
import ExportWxWxController from '../../../app/controller/wx/WxController';
import ExportWxWxStudentController from '../../../app/controller/wx/WxStudentController';
import ExportWxWxTeacherController from '../../../app/controller/wx/WxTeacherController';

declare module 'egg' {
  interface IController {
    authController: ExportAuthController;
    bonusRuleController: ExportBonusRuleController;
    courseController: ExportCourseController;
    dashboardController: ExportDashboardController;
    enumController: ExportEnumController;
    home: ExportHome;
    leaveAreaController: ExportLeaveAreaController;
    orderController: ExportOrderController;
    personController: ExportPersonController;
    shareController: ExportShareController;
    spaceRuleController: ExportSpaceRuleController;
    studentController: ExportStudentController;
    takeCourseController: ExportTakeCourseController;
    teacherController: ExportTeacherController;
    dict: {
      classTimeController: ExportDictClassTimeController;
      classTypeController: ExportDictClassTypeController;
      comboController: ExportDictComboController;
      productController: ExportDictProductController;
      teacherTypeController: ExportDictTeacherTypeController;
    }
    wx: {
      wxController: ExportWxWxController;
      wxStudentController: ExportWxWxStudentController;
      wxTeacherController: ExportWxWxTeacherController;
    }
  }
}

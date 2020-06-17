// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthController from '../../../app/controller/authController';
import ExportHome from '../../../app/controller/home';
import ExportPersonController from '../../../app/controller/PersonController';
import ExportDictClassTimeController from '../../../app/controller/dict/ClassTimeController';
import ExportDictClassTypeController from '../../../app/controller/dict/ClassTypeController';
import ExportDictComboController from '../../../app/controller/dict/ComboController';
import ExportDictProductController from '../../../app/controller/dict/ProductController';
import ExportDictTeacherTypeController from '../../../app/controller/dict/TeacherTypeController';

declare module 'egg' {
  interface IController {
    authController: ExportAuthController;
    home: ExportHome;
    personController: ExportPersonController;
    dict: {
      classTimeController: ExportDictClassTimeController;
      classTypeController: ExportDictClassTypeController;
      comboController: ExportDictComboController;
      productController: ExportDictProductController;
      teacherTypeController: ExportDictTeacherTypeController;
    }
  }
}

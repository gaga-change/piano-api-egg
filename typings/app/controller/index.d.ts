// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthController from '../../../app/controller/authController';
import ExportHome from '../../../app/controller/home';
import ExportDictClassTimeController from '../../../app/controller/dict/ClassTimeController';

declare module 'egg' {
  interface IController {
    authController: ExportAuthController;
    home: ExportHome;
    dict: {
      classTimeController: ExportDictClassTimeController;
    }
  }
}

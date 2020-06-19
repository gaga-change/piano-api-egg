import { Application } from 'egg';

export default (app: Application) => {
  const { controller, middleware, router } = app;
  const checkAuth = middleware.checkAuth();
  const mongoSession = middleware.mongoSession();

  router.get('/', controller.home.index);

  router.post('/api/auth/login', controller.authController.login);
  router.get('/api/auth/logout', controller.authController.logout);
  router.get('/api/auth/account', checkAuth, controller.authController.account);

  router.post('/api/classTimes', checkAuth, controller.dict.classTimeController.create);
  router.put('/api/classTimes/:id', checkAuth, controller.dict.classTimeController.update);
  router.get('/api/classTimes/:id', controller.dict.classTimeController.show);
  router.get('/api/classTimes', controller.dict.classTimeController.index);

  router.post('/api/classTypes', checkAuth, controller.dict.classTypeController.create);
  router.put('/api/classTypes/:id', checkAuth, controller.dict.classTypeController.update);
  router.get('/api/classTypes/:id', controller.dict.classTypeController.show);
  router.get('/api/classTypes', controller.dict.classTypeController.index);

  router.post('/api/combos', checkAuth, controller.dict.comboController.create);
  router.put('/api/combos/:id', checkAuth, controller.dict.comboController.update);
  router.get('/api/combos/:id', controller.dict.comboController.show);
  router.get('/api/combos', controller.dict.comboController.index);

  router.post('/api/products', checkAuth, controller.dict.productController.create);
  router.put('/api/products/:id', checkAuth, controller.dict.productController.update);
  router.get('/api/products/:id', controller.dict.productController.show);
  router.get('/api/products', controller.dict.productController.index);

  router.post('/api/teacherTypes', checkAuth, controller.dict.teacherTypeController.create);
  router.put('/api/teacherTypes/:id', checkAuth, controller.dict.teacherTypeController.update);
  router.get('/api/teacherTypes/:id', controller.dict.teacherTypeController.show);
  router.get('/api/teacherTypes', controller.dict.teacherTypeController.index);

  router.get('/api/persons', controller.personController.index);
  router.get('/api/persons/:id', controller.personController.show);

  router.post('/api/students', checkAuth, controller.studentController.create);
  router.put('/api/students/:id', checkAuth, controller.studentController.update);
  router.get('/api/students/:id', controller.studentController.show);
  router.get('/api/students', controller.studentController.index);

  router.post('/api/teachers', checkAuth, controller.teacherController.create);
  router.put('/api/teachers/:id', checkAuth, controller.teacherController.update);
  router.get('/api/teachers/:id', controller.teacherController.show);
  router.get('/api/teachers', controller.teacherController.index);

  router.post('/api/spaceRules/spaceRulesClearNoTeacherOrStudent', checkAuth, controller.spaceRuleController.clearDiscardDoc);
  router.post('/api/spaceRules/spaceRulesUpdate', checkAuth, mongoSession, controller.spaceRuleController.spaceRulesUpdate);
  router.get('/api/spaceRules/getSelfSpaceAreaInSpaceRule', controller.spaceRuleController.getSelfSpaceAreaInSpaceRule);
  router.get('/api/spaceRules/getSpaceArea', controller.spaceRuleController.getSpaceArea);
  router.get('/api/spaceRules', controller.spaceRuleController.index);

  router.get('/api/dashboard/readyDataNum', checkAuth, controller.dashboardController.readyDataNum);

  router.get('/api/enums/enumsTotal', checkAuth, controller.enumController.total);

  router.get('/api/shares', checkAuth, controller.shareController.index);

  router.post('/api/orders/findByStudentAndNoComplete', checkAuth, controller.orderController.findByStudentAndNoComplete);
  router.post('/api/orders', checkAuth, controller.orderController.create);
  router.put('/api/orders/:id', checkAuth, controller.orderController.update);
  router.get('/api/orders/:id', controller.orderController.show);
  router.get('/api/orders', controller.orderController.index);

  router.get('/api/courses/findByPersonAndMonth', controller.courseController.findByPersonAndMonth);
  router.get('/api/courses/coursesActivateArea', controller.courseController.coursesActivateArea);
  router.get('/api/courses/findByPersonAndDay', controller.courseController.findByPersonAndDay);
  router.post('/api/courses', checkAuth, mongoSession, controller.courseController.create);
  router.put('/api/courses/:id', checkAuth, mongoSession, controller.courseController.update);
  router.get('/api/courses/:id', controller.courseController.show);
  router.get('/api/courses', controller.courseController.index);

  router.post('/api/leaveAreas', checkAuth, mongoSession, controller.leaveAreaController.create);
  router.put('/api/leaveAreas/:id', checkAuth, mongoSession, controller.leaveAreaController.update);
  router.get('/api/leaveAreas/:id', controller.leaveAreaController.show);
  router.get('/api/leaveAreas', controller.leaveAreaController.index);

  router.post('/api/takeCourses', checkAuth, mongoSession, controller.takeCourseController.create);
  router.put('/api/takeCourses/:id', checkAuth, mongoSession, controller.takeCourseController.update);
  router.get('/api/takeCourses/:id', controller.takeCourseController.show);
  router.get('/api/takeCourses', controller.takeCourseController.index);
};

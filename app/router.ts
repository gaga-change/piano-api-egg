import { Application } from 'egg';

export default (app: Application) => {
  const { controller, middleware, router } = app;
  const checkAuth = middleware.checkAuth();
  const mongoSession = middleware.mongoSession();

  router.get('/', controller.home.index);

  router.post('/api/auth/login', controller.authController.login);
  router.get('/api/auth/logout', controller.authController.logout);
  router.get('/api/auth/account', checkAuth, controller.authController.account);

  router.post('/api/classTimes', mongoSession, checkAuth, controller.dict.classTimeController.create);
  router.put('/api/classTimes/:id', mongoSession, checkAuth, controller.dict.classTimeController.update);
  router.get('/api/classTimes/:id', controller.dict.classTimeController.show);
  router.get('/api/classTimes', controller.dict.classTimeController.index);

  router.post('/api/classTypes', mongoSession, checkAuth, controller.dict.classTypeController.create);
  router.put('/api/classTypes/:id', mongoSession, checkAuth, controller.dict.classTypeController.update);
  router.get('/api/classTypes/:id', controller.dict.classTypeController.show);
  router.get('/api/classTypes', controller.dict.classTypeController.index);

  router.post('/api/combos', mongoSession, checkAuth, controller.dict.comboController.create);
  router.put('/api/combos/:id', mongoSession, checkAuth, controller.dict.comboController.update);
  router.get('/api/combos/:id', controller.dict.comboController.show);
  router.get('/api/combos', controller.dict.comboController.index);

  router.post('/api/products', mongoSession, checkAuth, controller.dict.productController.create);
  router.put('/api/products/:id', mongoSession, checkAuth, controller.dict.productController.update);
  router.get('/api/products/:id', controller.dict.productController.show);
  router.get('/api/products', controller.dict.productController.index);

  router.post('/api/teacherTypes', mongoSession, checkAuth, controller.dict.teacherTypeController.create);
  router.put('/api/teacherTypes/:id', mongoSession, checkAuth, controller.dict.teacherTypeController.update);
  router.get('/api/teacherTypes/:id', controller.dict.teacherTypeController.show);
  router.get('/api/teacherTypes', controller.dict.teacherTypeController.index);

};

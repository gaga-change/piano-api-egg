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

};

import { Application } from 'egg';

export default (app: Application) => {
  const { controller, middleware, router } = app;
  const checkAuth = middleware.checkAuth();

  router.get('/', controller.home.index);

  // authController
  router.post('/api/auth/login', controller.authController.login);
  router.get('/api/auth/logout', controller.authController.logout);
  router.get('/api/auth/account', checkAuth, controller.authController.account);

};

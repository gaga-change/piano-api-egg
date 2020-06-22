import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/DashboardController.test.test.ts', () => {

  it('should GET /api/dashboard/readyDataNum 获取用户待审核数量', async () => {
    app.mockSession({
      user: {
        name: 'admin',
      },
    });
    await app.httpRequest()
      .get('/api/dashboard/readyDataNum')
      .expect(200);
  });
});

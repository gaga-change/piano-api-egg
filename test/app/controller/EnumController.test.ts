import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/EnumController.test.ts', () => {

  it('should GET /api/enums/enumsTotal 获取所有枚举', async () => {
    app.mockSession({
      user: {
        name: 'admin',
      },
    });
    await app.httpRequest()
      .get('/api/enums/enumsTotal')
      .expect(200);
  });
});

import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';
// import { Context } from 'egg';

describe('test/app/controller/dict/classTimesController.test.ts', () => {
  // let ctx: Context;
  const removeQueryArr: any = [];
  // before(async () => {
  //   app.mockSession({ user: {} });
  // });

  it('should POST /api/classTimes 增', async () => {
    app.mockSession({ user: {} });
    const testName = 'test_' + Date.now() + Math.random();
    const classTime: any = {
      name: testName,
      time: Date.now() + Math.random(),
    };
    removeQueryArr.push({ name: testName });
    const res1 = await app.httpRequest()
      .post('/api/classTimes')
      .send(classTime)
      .expect(200);
    assert(res1.body.name === classTime.name && classTime.time === res1.body.time);
  });

  it('should POST /api/classTimes/:id 改', async () => {
    app.mockSession({ user: {} });
    const { ClassTime } = app.model;
    const testName = 'test_' + Date.now() + Math.random();
    removeQueryArr.push({ name: testName });
    const classTime = new ClassTime({
      name: testName,
      time: Date.now() + Math.random(),
    });
    await classTime.save();
    const newTime = Date.now() + Math.random();
    const res1 = await app.httpRequest()
      .put(`/api/classTimes/${classTime._id}`)
      .send({ time: newTime })
      .expect(200);
    assert(res1.body.time === newTime);
  });

  it('should GET /api/classTimes/:id 查询', async () => {
    const { ClassTime } = app.model;
    const testName = 'test_' + Date.now() + Math.random();
    removeQueryArr.push({ name: testName });
    const classTime = new ClassTime({
      name: testName,
      time: Date.now() + Math.random(),
    });
    await classTime.save();
    const res1 = await app.httpRequest()
      .get(`/api/classTimes/${classTime._id}`)
      .expect(200);
    assert(res1.body.name === testName);
  });

  it('should GET /api/classTimes 列表', async () => {
    const res1 = await app.httpRequest()
      .get('/api/classTimes')
      .expect(200);
    assert(typeof res1.body.total === 'number' && res1.body.list instanceof Array);
  });

  after(async () => {
    const { ClassTime } = app.model;
    for (let i = 0; i < removeQueryArr.length; i++) {
      await ClassTime.deleteMany(removeQueryArr[i]);
    }
  });
});

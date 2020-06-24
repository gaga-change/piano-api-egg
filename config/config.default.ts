import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1592204849000_5993';

  // add your egg config in here
  config.middleware = [ 'wxOpenid' ];

  config.wxOpenid = {};

  config.mongoose = {
    url: process.env.MONGO_LINK || 'mongodb://192.168.2.173:30201,192.168.2.173:30202,192.168.2.173:30203/carry_test',
    options: {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  };

  config.onerror = {
    all(err, ctx) {
      console.log('# error:', err);
      console.log('# error:', ctx.status);
      if (ctx.status === 422) { // 参数校验
        ctx.body = err.errors.map(v => `${v.field}:${v.message}`).join(',');
      } else if (err.code === 11000) { // 字段重复校验
        /carry_test.(\w+) /g.exec(err.message);
        const { duplicateKey } = ctx.state;
        let keyName: any = Object.keys(err.keyValue)[0];
        if (duplicateKey && typeof duplicateKey === 'object' && duplicateKey[keyName]) {
          keyName = duplicateKey[keyName];
        }
        ctx.body = `${keyName}已存在相同值,不允许重复添加`;
      } else {
        ctx.body = err.message;
      }
    },
    // html(err, ctx) {
    //   // html hander
    //   ctx.body = '<h3>error</h3>';
    //   ctx.status = 500;
    // },
    // json(err, ctx) {
    //   console.log('# error:', err);
    //   console.log('# error:', ctx.status);
    //   if (ctx.status === 422) {
    //     ctx.body = err.errors.map(v => `${v.field}:${v.message}`).join(',');
    //   } else {
    //     console.log('??? json error ');
    //     ctx.body = 'gagaga';
    //   }
    // },
    // jsonp(err, ctx) {
    //   // 一般来说，不需要特殊针对 jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
    // },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};

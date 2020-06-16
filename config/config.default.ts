import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1592204849000_5993';

  // add your egg config in here
  config.middleware = [];

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/test',
    options: {
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
  };

  config.onerror = {
    // all(err, ctx) {
    //   // 在此处定义针对所有响应类型的错误处理方法
    //   // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
    //   ctx.body = 'error';
    //   ctx.status = 500;
    // },
    // html(err, ctx) {
    //   // html hander
    //   ctx.body = '<h3>error</h3>';
    //   ctx.status = 500;
    // },
    json(err, ctx) {
      console.log('# error:', err);
      console.log('# error:', ctx.status);
      if (ctx.status === 422) {
        ctx.body = err.errors.map(v => `${v.field}:${v.message}`).join(',');
      } else {
        console.log('??? json error ');
        ctx.body = 'gagaga';
      }
    },
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

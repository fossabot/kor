const Koa = require('koa');
const Router = require('koa-router');
const methods = require('methods');

class Kor extends Koa {
  constructor() {
    super();
  }
  route(url, router) {
    url = url === '*' ? '/' : url;
    const newRouter = new Router();

    if (router instanceof Router) {
      newRouter.use(url, router.routes(), router.allowedMethods());
    } else if (typeof router === 'function') {
      newRouter.get(url, router);
    }

    return this.use(newRouter.routes());
  }
}

// koa-route support all method
methods.concat(['all']).forEach(method => {
  // method is lowercase all ready
  Object.defineProperty(Kor.prototype, method, {
    value: function(url, handler) {
      const newRouter = new Router();
      const routerDefiner = newRouter[method];
      if (!routerDefiner) throw new Error(`Not support the method ${method}`);
      routerDefiner.call(newRouter, url, handler);
      return this.use(newRouter.routes());
    }
  });
});

module.exports = Kor;
module.exports.default = Kor;
module.exports.Kor = Kor;
module.exports.Router = Router;

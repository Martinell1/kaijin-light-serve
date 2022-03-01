const fs = require('fs')
const Router = require("koa-router");
module.exports = (app) => {
  const routers = new Router()
  routers.prefix('/api')
  fs.readdirSync(__dirname).forEach(file => {
    if(file === 'index.js'){
      return
    }else{
      const route = require(`./${file}`);
      routers.use(route.routes(),route.allowedMethods());
      app.use(routers.routes(),routers.allowedMethods())
    }
  });
}
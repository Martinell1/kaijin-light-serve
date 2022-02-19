const Koa = require('Koa');
const Router = require('koa-router');
const app = new Koa()
const router = new Router()

app.use(router.routes())

app.listen(3000,()=>{
  console.log('koa 监听 3000 端口');
})
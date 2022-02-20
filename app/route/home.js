const Router = require("koa-router");
const router = new Router()

router.get('/',(ctx)=>{
  console.log('这里');
  ctx.body = 'home'
})
module.exports = router
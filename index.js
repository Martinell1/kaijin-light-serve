const Koa = require('Koa')
const app = new Koa()

app.listen(3000,()=>{
  console.log('koa 监听 3000 端口');
})
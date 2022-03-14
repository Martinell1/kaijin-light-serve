const Koa = require('Koa');
const cors = require('koa2-cors')
const static = require('koa-static')
const body = require('koa-body');
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const app = new Koa()
const routing = require('./route');
const path = require('path')


app.use(static(path.join(__dirname,'./static')))
app.use(cors({
  origin: function(ctx) { //设置允许来自指定域名请求
    return '*'; //只允许http://localhost:8080这个域名的请求
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH','OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['origin','Content-Type', 'Authorization', 'Accept', 'Token'], //设置服务器支持的所有头信息字段
}))
app.use(error({
  // postFormat:(e,{stack,...rest})=>{
  //   process.env.NODE_ENV === 'development' ?  : {stack,...rest}
  // }
}))
app.use(body({
  multipart:true,
  formidable:{
    uploadDir:path.join(__dirname,'./static'),
    keepExtensions:true
  }
}))
app.use(parameter(app))
routing(app)

app.listen(3001,()=>{
  console.log('koa 监听 3001 端口');
})
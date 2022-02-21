const Koa = require('Koa');
const static = require('koa-static')
const body = require('koa-body');
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const app = new Koa()
const routing = require('./route');
const path = require('path')


app.use(static(path.join(__dirname,'public')))
app.use(error({
  // postFormat:(e,{stack,...rest})=>{
  //   process.env.NODE_ENV === 'production' ? rest : {stack,...rest}
  // }
}))
app.use(body({
  multipart:true,
  formidable:{
    uploadDir:path.join(__dirname,'public/uploads'),
    keepExtensions:true
  }
}))
app.use(parameter(app))
routing(app)

app.listen(3000,()=>{
  console.log('koa 监听 3000 端口');
})
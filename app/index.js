const Koa = require('Koa');
const body = require('koa-body');
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const app = new Koa()
const routing = require('./route');


app.use(error({
  // postFormat:(e,{stack,...rest})=>{
  //   process.env.NODE_ENV === 'production' ? rest : {stack,...rest}
  // }
}))
app.use(body())
app.use(parameter(app))
routing(app)

app.listen(3000,()=>{
  console.log('koa 监听 3000 端口');
})
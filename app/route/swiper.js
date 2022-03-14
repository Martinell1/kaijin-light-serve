const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/swiper'})
const {SECRET} = require('../config/constance')

const {find,create,update} 
= require('../controller/swiper');

const auth = jwt({secret:SECRET})

router.get('/',find)  //文章列表

router.post('/',auth,create) //新增文章

router.patch('/:id',auth,update) //更新文章

module.exports = router
const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/link'})
const {SECRET} = require('../config/constance')

const {find,findById,create,update,del} 
= require('../controller/link');

const auth = jwt({secret:SECRET})

router.get('/',find)  //文章列表

router.get('/:id',findById) 

router.post('/',auth,create) //新增文章

router.patch('/:id',auth,update) //更新文章

router.delete('/:id',auth,del) //更新文章

module.exports = router
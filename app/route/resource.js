const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/resource'})
const {SECRET} = require('../config/constance')

const {find,hot,findById,create,update,checkResourceExist,del} 
= require('../controller/resource');

const auth = jwt({secret:SECRET})

router.get('/',find)  //文章列表

router.get('/hot',hot)

router.get('/:id',findById) 

router.post('/',auth,create) //新增文章

router.patch('/:id',auth,update) //更新文章

router.delete('/:id',auth,checkResourceExist,del)

module.exports = router
const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/moment'})
const {SECRET} = require('../config/constance')

const {checkMomentExist,
  find,total,following,hot,create,update,findById,delete:del} 
= require('../controller/moment');

const auth = jwt({secret:SECRET})

router.get('/',find)  //问题列表

router.get('/total',total)

router.get('/following',auth,following)  //问题列表

router.get('/hot',hot)  //问题列表

router.get('/:id',checkMomentExist,findById) //获取单个问题

router.post('/',auth,create) //新增问题

router.patch('/:id',auth,checkMomentExist,update) //更新问题

router.delete('/:id',auth,checkMomentExist,del)


module.exports = router
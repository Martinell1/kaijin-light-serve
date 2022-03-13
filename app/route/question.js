const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/question'})
const {SECRET} = require('../config/constance')

const {checkQuestionExist,
  find,total,hot,create,update,findById,delete:del} 
= require('../controller/question');

const auth = jwt({secret:SECRET})

router.get('/',find)  //问题列表

router.get('/total',total)

router.get('/hot',hot)  //问题列表

router.get('/:id',checkQuestionExist,findById) //获取单个问题

router.post('/',auth,create) //新增问题

router.patch('/:id',auth,checkQuestionExist,update) //更新问题

router.delete('/:id',auth,checkQuestionExist,del)


module.exports = router
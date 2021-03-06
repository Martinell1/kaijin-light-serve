const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/question/:questionId/answer'})
const {SECRET} = require('../config/constance')

const {checkAnswerExist,checkholder,
  find,total,create,update,findById,delete:del} 
= require('../controller/answer');

const auth = jwt({secret:SECRET})

router.get('/',find)  //回答列表

router.get('/total',total) 

router.post('/',auth,create) //回答问题

router.get('/:id',checkAnswerExist,findById) //获取单个问题

router.patch('/:id',auth,checkAnswerExist,checkholder,update) //更新回答

router.delete('/:id',auth,checkAnswerExist,checkholder,del)

module.exports = router
const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/questions/:questionId/answer'})
const {SECRET} = require('../config/constance')

const {checkAnswerExist,checkAnswerer,
  find,create,update,findById,delete:del} 
= require('../controller/answer');

const auth = jwt({secret:SECRET})

router.get('/',find)

router.post('/',create)

router.patch('/:id',auth,checkAnswerExist,checkAnswerer,update)

router.get('/:id',checkAnswerExist,findById)

router.delete('/:id',auth,checkAnswerExist,checkAnswerer,del)


module.exports = router
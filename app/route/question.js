const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/question'})
const {SECRET} = require('../config/constance')

const {checkQuestionExist,
  find,create,update,findById,delete:del} 
= require('../controller/question');

const auth = jwt({secret:SECRET})

router.get('/',find)

router.post('/',create)

router.patch('/:id',auth,checkQuestionExist,update)

router.get('/:id',checkQuestionExist,findById)

router.delete('/:id',auth,checkQuestionExist,del)


module.exports = router
const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/questions/:questionId/answer/:answerId/comment'})
const {SECRET} = require('../config/constance')

const {checkCommentExist,checkCommenter,
  find,create,update,findById,delete:del} 
= require('../controller/comment');

const auth = jwt({secret:SECRET})

router.get('/',find)

router.post('/',create)

router.patch('/:id',auth,checkCommentExist,checkCommenter,update)

router.get('/:id',checkCommentExist,findById)

router.delete('/:id',auth,checkCommentExist,checkCommenter,del)


module.exports = router
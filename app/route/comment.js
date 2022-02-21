const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/questions/:questionId/answer/:answerId/comment'})
const {SECRET} = require('../config/constance')

const {checkCommentExist,checkCommenter,
  find,create,update,findById,delete:del} 
= require('../controller/comment');

const auth = jwt({secret:SECRET})

router.get('/',find)  //评论列表

router.get('/:id',checkCommentExist,findById) //获取单个评论

router.post('/',auth,create)//评论

router.patch('/:id',auth,checkCommentExist,checkCommenter,update) //更新评论

router.delete('/:id',auth,checkCommentExist,checkCommenter,del)


module.exports = router
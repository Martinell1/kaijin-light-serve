const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/article/:articleId/talk'})
const {SECRET} = require('../config/constance')

const {checkTalkExist,checkTalker,
  find,create,update,findById,delete:del} 
= require('../controller/talk');

const auth = jwt({secret:SECRET})

router.get('/',find)  //讨论列表

router.get('/:id',checkTalkExist,findById) //获取单个讨论

router.post('/',auth,create)//讨论

router.patch('/:id',auth,checkTalkExist,checkTalker,update) //更新讨论

router.delete('/:id',auth,checkTalkExist,checkTalker,del)


module.exports = router
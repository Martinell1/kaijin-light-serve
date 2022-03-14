const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/topic'})
const {SECRET} = require('../config/constance')

const {checkTopicExist,
  find,total,create,update,findById,del,
  listFollowers,listQuestions} = require('../controller/topic');

const auth = jwt({secret:SECRET})

router.get('/',find)  //话题列表

router.get('/total',total)  

router.post('/',create) //新建话题

router.patch('/:id',auth,checkTopicExist,update) //更新话题

router.get('/:id',checkTopicExist,findById) //获取单个话题

router.delete('/:id',auth,checkTopicExist,del)

router.get('/:id/followers',checkTopicExist,listFollowers) //获取粉丝列表

router.get('/:id/questions',checkTopicExist,listQuestions) //获取问题列表


module.exports = router
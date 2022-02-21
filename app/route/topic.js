const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/topic'})
const {SECRET} = require('../config/constance')

const {checkTopicExist,
  find,create,update,findById,
  listFollowers,listQuestions} = require('../controller/topic');

const auth = jwt({secret:SECRET})

router.get('/',find)

router.post('/',create)

router.patch('/:id',auth,checkTopicExist,update)

router.get('/:id',checkTopicExist,findById)

router.get('/:id/followers',checkTopicExist,listFollowers)

router.get('/:id/questions',checkTopicExist,listQuestions)


module.exports = router
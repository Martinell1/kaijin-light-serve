const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/article'})
const {SECRET} = require('../config/constance')

const {checkArticleExist,
  find,hot,total,create,update,findById,delete:del} 
= require('../controller/article');

const auth = jwt({secret:SECRET})

router.get('/',find)  //文章列表

router.get('/total',total)

router.get('/hot',hot)

router.get('/:id',checkArticleExist,findById) //获取单个文章

router.post('/',auth,create) //新增文章

router.patch('/:id',auth,checkArticleExist,update) //更新文章

router.delete('/:id',auth,checkArticleExist,del)


module.exports = router
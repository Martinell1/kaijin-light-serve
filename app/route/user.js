const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/user'})
const {SECRET} = require('../config/constance')

const {checkOwner,checkUserExist,
  find,create,update,findById,del,
  login,
  listFollowing,listFollowers,follow,unfollow,          //用户
  listFollowingTopics,unfollowTopic, followTopic,        //话题
  listQuestions,                                        //问题
  listLikingAnswers,likeAnswer,unlikeAnswer,           //回答 点赞
  listDislikingAnswers,dislikeAnswer,undislikeAnswer,  //回答 点踩
  listCollectingAnswers,collectAnswer,uncollectAnswer} //回答 收藏
= require('../controller/user')

const {checkTopicExist} = require('../controller/topic')
const {checkAnswerExist} = require('../controller/answer')

const auth = jwt({secret:SECRET})

router.get('/',find)//获取用户列表

router.post('/',create)//新建用户

router.patch('/:id',auth,checkOwner,update)//更新用户

router.get('/:id',findById)//获取指定用户

router.delete('/:id',auth,checkOwner,del)//删除用户

router.post('/login',login)//登录

router.get('/:id/following',listFollowing)//某人的关注列表

router.get('/:id/followers',listFollowers)//某人的粉丝列表

router.put('/following/:id',auth,checkUserExist,follow)//关注某人

router.delete('/following/:id',auth,checkUserExist,unfollow)//取关某人

router.get('/:id/followingTopics',listFollowingTopics) //关注的话题列表

router.put('/followingTopics/:id',auth,checkTopicExist,followTopic)//关注某话题

router.delete('/followingTopics/:id',auth,checkTopicExist,unfollowTopic)//取关某话题

router.get('/:id/questions',listQuestions)  //问题列表

router.get('/:id/likingAnswers',listLikingAnswers) //点赞列表

router.put('/likingAnswers/:id',auth,checkAnswerExist,likeAnswer,undislikeAnswer) //点赞

router.delete('/likingAnswers/:id',auth,checkAnswerExist,unlikeAnswer)//取消点赞

router.get('/:id/dislikingAnswers',listDislikingAnswers) //点踩列表

router.put('/dislikingAnswers/:id',auth,checkAnswerExist,dislikeAnswer,unlikeAnswer)  //点踩

router.delete('/dislikingAnswers/:id',auth,checkAnswerExist,undislikeAnswer)  //取消点餐

router.get('/:id/collectingAnswers',listCollectingAnswers)  //收藏列表

router.put('/collectingAnswers/:id',auth,checkAnswerExist,collectAnswer)  //收藏

router.delete('/collectingAnswers/:id',auth,checkAnswerExist,uncollectAnswer) //取消收藏

module.exports = router
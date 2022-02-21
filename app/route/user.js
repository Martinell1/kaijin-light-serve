const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/user'})
const {SECRET} = require('../config/constance')

const {checkOwner,checkUserExist,
  find,create,update,findById,del,
  login,
  listFollowing,listFollowers,follow,unfollow, unfollowTopic, followTopic, listQuestions,
  listLikeingAnswers,likeAnswer,unlikeAnswer,
  listDislikeingAnswers,dislikeAnswer,undislikeAnswer,
  listCollectingAnswers,collectAnswer,uncollectAnswer} 
= require('../controller/user')

const {checkTopicExist} = require('../controller/topic')
const {checkAnswerExist} = require('../controller/answer')

const auth = jwt({secret:SECRET})

router.get('/',find)

router.post('/',create)

router.patch('/:id',auth,checkOwner,update)

router.get('/:id',findById)

router.delete('/:id',auth,checkOwner,del)

router.post('/login',login)

router.get('/:id/following',listFollowing)

router.get('/:id/followers',listFollowers)

router.put('/following/:id',auth,checkUserExist,follow)

router.delete('/following/:id',auth,checkUserExist,unfollow)

router.put('/followingTopics/:id',auth,checkTopicExist,followTopic)

router.delete('/followingTopics/:id',auth,checkTopicExist,unfollowTopic)

router.get('/:id/questions',listQuestions)

router.get('/:id/likingAnswers',listLikeingAnswers)

router.put('/likingAnswers/:id',auth,checkAnswerExist,likeAnswer,undislikeAnswer)

router.delete('/likingAnswers/:id',auth,checkAnswerExist,unlikeAnswer)

router.get('/:id/dislikingAnswers',listDislikeingAnswers)

router.put('/dislikingAnswers/:id',auth,checkAnswerExist,dislikeAnswer,unlikeAnswer)

router.delete('/dislikingAnswers/:id',auth,checkAnswerExist,undislikeAnswer)

//收藏
router.get('/:id/collectingAnswers',listCollectingAnswers)

router.put('/collectingAnswers/:id',auth,checkAnswerExist,collectAnswer)

router.delete('/collectingAnswers/:id',auth,checkAnswerExist,uncollectAnswer)

module.exports = router
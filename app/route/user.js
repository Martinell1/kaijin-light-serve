const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/user'})
const {SECRET} = require('../config/constance')

const {checkOwner,checkUserExist,
  find,create,update,findById,del,login,
  listQuestions,listArticles,listAnswers,listComments,listTalks,listFollowers,listFollowings,
  setFollowField,follow,unfollow,   //关注
  setLikeField,like,unlike,dislike,undislike}  //点赞/点踩
= require('../controller/user')

const {checkTopicExist} = require('../controller/topic')
const {checkAnswerExist} = require('../controller/answer');
const {checkArticleExist} = require('../controller/article');
const {checkQuestionExist} = require('../controller/question')
const {checkCommentExist} = require('../controller/comment')
const {checkTalkExist} = require('../controller/talk')

const auth = jwt({secret:SECRET})

router.get('/',find)//获取用户列表

router.post('/',create)//新建用户

router.patch('/:id',auth,checkOwner,update)//更新用户

router.get('/:id',findById)//获取指定用户

router.delete('/:id',auth,checkOwner,del)//删除用户

router.post('/login',login)//登录

router.get('/:id/questions',listQuestions)  //问题列表

router.get('/:id/articles',listArticles)  //文章列表

router.get('/:id/answers',listAnswers)  //回答列表

router.get('/:id/comments',listComments)  //评论列表

router.get('/:id/talks',listTalks)  //讨论列表

router.get('/:id/followers',listFollowers)//粉丝列表

router.get('/:id/followings',listFollowings)//粉丝列表

//=====================关注

//=====用户

router.put('/followings/:id',auth,checkUserExist,setFollowField,follow)//关注某人

router.delete('/followings/:id',auth,checkUserExist,setFollowField,unfollow)//取关某人

//=====话题

router.put('/followingTopics/:id',auth,checkTopicExist,setFollowField,follow)//关注某话题

router.delete('/followingTopics/:id',auth,checkTopicExist,setFollowField,unfollow)//取关某话题

//=====回答

router.put('/followingAnswers/:id',auth,checkAnswerExist,setFollowField,follow)  //关注回答

router.delete('/followingAnswers/:id',auth,checkAnswerExist,setFollowField,unfollow) //取消关注回答

//=====问题

router.put('/followingQuestions/:id',auth,checkQuestionExist,setFollowField,follow)  //关注问题

router.delete('/followingQuestions/:id',auth,checkQuestionExist,setFollowField,unfollow) //取消关注问题

//=====文章

router.put('/followingArticles/:id',auth,checkArticleExist,setFollowField,follow)  //关注文章

router.delete('/followingArticles/:id',auth,checkArticleExist,setFollowField,unfollow) //取消关注文章



//=====================点赞/点踩

//=====回答

router.put('/likingAnswers/:id',auth,checkAnswerExist,setLikeField,like,undislike) //点赞回答

router.delete('/likingAnswers/:id',auth,checkAnswerExist,setLikeField,unlike)//取消点赞回答

router.put('/dislikingAnswers/:id',auth,checkAnswerExist,setLikeField,dislike,unlike)  //点踩回答

router.delete('/dislikingAnswers/:id',auth,checkAnswerExist,setLikeField,undislike)  //取消点踩回答

//=====文章

router.put('/likingArticles/:id',auth,checkArticleExist,setLikeField,like) //点赞文章

router.delete('/likingArticles/:id',auth,checkArticleExist,setLikeField,unlike) //取消点赞文章

//=====问题

router.put('/likingQuestions/:id',auth,checkQuestionExist,setLikeField,like) //点赞问题

router.delete('/likingQuestions/:id',auth,checkQuestionExist,setLikeField,unlike) //取消点赞问题

//=====评论

router.put('/likingComments/:id',auth,checkCommentExist,setLikeField,like,undislike) //点赞评论

router.delete('/likingComments/:id',auth,checkCommentExist,setLikeField,unlike) //取消点赞评论

router.put('/dislikingComments/:id',auth,checkCommentExist,setLikeField,dislike,unlike)  //点踩评论

router.delete('/dislikingComments/:id',auth,checkCommentExist,setLikeField,undislike)  //取消点踩评论

//=====讨论

router.put('/likingTalks/:id',auth,checkTalkExist,setLikeField,like,undislike) //点赞讨论

router.delete('/likingTalks/:id',auth,checkTalkExist,setLikeField,unlike) //取消点赞讨论

router.put('/dislikingTalks/:id',auth,checkTalkExist,setLikeField,dislike,unlike)  //点踩讨论

router.delete('/dislikingTalks/:id',auth,checkTalkExist,setLikeField,undislike)  //取消点踩讨论

module.exports = router
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/constance.js')
const fieldHandle = require('../utils/fields')
const User = require('../model/user')
const Question = require('../model/question')
const Answer = require('../model/answer')
const Article = require('../model/article')
const Comment = require('../model/comment')
const Talk = require('../model/talk')
const Moment = require('../model/moment')

class userController{
  async checkOwner(ctx,next){
    if(ctx.params.id !== ctx.state.user._id){
        ctx.throw(403,'没有权限')
    }
    await next()
  }

  async total(ctx,next){
    const users = await Users.find()
    ctx.body = users.length
  }

  async checkUserExist(ctx,next){
    const user = await User.findById(ctx.params.id)
    if(!user){
      ctx.throw(404,'该用户不存在')
    }
    await next()
  }

  async find(ctx){
    const {per_page,q} = ctx.query
    const page = Math.max(ctx.query.page * 1,1) - 1
    const perPage = Math.max(per_page * 1,1)
    ctx.body = await User.find({nickname:new RegExp(ctx.query.q)})
                         .limit(perPage)
                         .skip(page * perPage)
  }

  async findById(ctx){
    const {fields} = ctx.query
    const user = await User.findById(ctx.params.id)
                           .select(fieldHandle(fields))
    
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user
  }

  async create(ctx){
    ctx.verifyParams({
      account:{type:'string',required:true},
      password:{type:'string',required:true},
      nickname:{type:'string',required:true}
    })
    const body = ctx.request.body
    const {account} = body
    const repeatUser = await User.findOne({account})
    if(repeatUser){
      ctx.throw(409,'用户名已被占用')
    }
    const user = await new User(body).save()
    ctx.body = user
  }

  async update(ctx){
    ctx.verifyParams({
      password:{type:'string',required:false},
      nickname:{type:'string',required:false}
    })
    const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    const newUser = await User.findById(ctx.params.id)
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = newUser
  }

  async del(ctx){
    const user = await User.findByIdAndRemove(ctx.params.id)
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = '删除成功'
  }

  async login(ctx){
    ctx.verifyParams({
      account:{type:'string',required:true},
      password:{type:'string',required:true}
    })
    const {account,password} = ctx.request.body
    const user = await User.findOne({account,password})
    if(!user){
      ctx.throw(401,'用户名或密码不正确')
    }
    const {_id} = user
    const token = jwt.sign({_id},SECRET,{expiresIn:'7d'})
    ctx.body = {id:_id,token}
  }

  //问题列表
  async listQuestions(ctx){
    const questions = await Question.find({holder:ctx.params.id}).populate('holder topics')
    ctx.body = questions
  }

  //回答列表
  async listAnswers(ctx){
    const answers = await Answer.find({holder:ctx.params.id}).populate('holder question')
    ctx.body = answers
  }

  //文章列表
  async listArticles(ctx){
    const articles = await Article.find({holder:ctx.params.id}).populate('holder topics')
    ctx.body = articles
  }

  //评论列表
  async listComments(ctx){
    const comments = await Comment.find({holder:ctx.params.id})
    ctx.body = comments
  }

  //讨论列表
  async listTalks(ctx){
    const talks = await Talk.find({holder:ctx.params.id})
    ctx.body = talks
  }

  //获取粉丝列表
  async listFollowers(ctx){
    const users = await User.find({followings:ctx.params.id})
    ctx.body = users
 }

  //获取关注列表
  async listFollowings(ctx){
    const user = await User.findById(ctx.params.id).populate('followings')
    ctx.body = user.followings
 }

  //=====================关注

  async setFollowField(ctx,next){
    if(ctx.state.article){
      ctx.state.field = 'followingArticles'
      ctx.state.ctl = Article
    }else if(ctx.state.topic){
      ctx.state.field = 'followingTopics'
      ctx.state.ctl = Topic
    }else if(ctx.state.question){
      ctx.state.field = 'followingQuestions'
      ctx.state.ctl = Question
    }else if(ctx.state.answer){
      ctx.state.field = 'followingAnswers'
      ctx.state.ctl = Answer
    }else if(ctx.state.user){
      ctx.state.field = 'followings'
      ctx.state.ctl = User
    }
    await next()
  }

  //关注
  async follow(ctx){
    const {field,ctl,user} = ctx.state
    const me = await User.findById(user._id).select('+'+field)
    if(!me[field].map(id => id.toString()).includes(ctx.params.id)){
      me[field].push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }

  //取关
  async unfollow(ctx){
    const {field,ctl,user} = ctx.state
    const me = await User.findById(user._id).select('+'+field)
    const index = me[field].map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me[field].splice(index,1)
      me.save()
    }
    ctx.status = 204
  }

  //=====================点赞/点踩

  async setLikeField(ctx,next){
    if(ctx.state.answer){
      ctx.state.field = 'likingAnswers'
      ctx.state.ctl = Answer
    }else if(ctx.state.article){
      ctx.state.field = 'likingArticles'
      ctx.state.ctl = Article
    }else if(ctx.state.question){
      ctx.state.field = 'likingQuestions'
      ctx.state.ctl = Question
    }else if(ctx.state.comment){
      ctx.state.field = 'likingComments'
      ctx.state.ctl = Comment
    }else if(ctx.state.moment){
      ctx.state.field = 'likingMoments'
      ctx.state.ctl = Moment
    }else if(ctx.state.talk){
      ctx.state.field = 'likingTalks'
      ctx.state.ctl = Talk
    }
    await next()
  }

  //点赞
  async like(ctx,next){
    const {field,ctl,user} = ctx.state
    const me = await User.findById(user._id).select('+'+field)
    if(!me[field].map(id => id.toString()).includes(ctx.params.id)){
      me[field].push(ctx.params.id)
      me.save()
      await ctl.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
    }else{
      ctx.body = '已点赞'
    }
    ctx.status = 204
  }

  //取消点赞
  async unlike(ctx){
    const {field,ctl,user} = ctx.state
    const me = await User.findById(user._id).select('+'+field)
    const index = me[field].map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me[field].splice(index,1)
      me.save()
      await ctl.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:-1}})
    }else{
      ctx.body = '已点赞'
    }
    ctx.status = 204
  }


}

module.exports = new userController()
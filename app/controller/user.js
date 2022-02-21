const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/constance.js')
const fieldHandle = require('../utils/fields')
const User = require('../model/user')
const Question = require('../model/question')
const Answer = require('../model/answer')

class userController{
  async find(ctx){
    const {per_page} = ctx.query
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
                           .populate('following locations employments.company employments.job education.school education.major')
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
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user
  }

  async del(ctx){
    const user = await User.findByIdAndRemove(ctx.params.id)
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.status = 204
  }

  async login(ctx){
    ctx.verifyParams({
      account:{type:'string',required:true},
      password:{type:'string',required:true}
    })
    const user = await User.findOne(ctx.request.body)
    if(!user){
      ctx.throw(401,'用户名或密码不正确')
    }
    const {_id} = user
    const token = jwt.sign({_id},SECRET,{expiresIn:'7d'})
    ctx.body = {token}
  }

  async checkUserExist(ctx,next){
    const user = await User.findById(ctx.params.id)
    if(!user){
      ctx.throw(404,'该用户不存在')
    }
    await next()
  }

  //关注列表
  async listFollowing(ctx){
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if(!user){
      ctx.throw(404)
    }
    ctx.body = user.following
  }

  //获取粉丝列表
  async listFollowers(ctx){
     const users = await User.find({following:ctx.params.id})
     ctx.body = users
  }

  async follow(ctx){
    const me = await User.findById(ctx.state.user._id).select('+following')
    if(!me.following.map(id => id.toString()).includes(ctx.params.id)){
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }

  async unfollow(ctx){
    const me = await User.findById(ctx.state.user._id).select('+following')
    console.log(ctx.state.user._id,me);
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me.following.splice(index,1)
      me.save()
    }
    ctx.status = 204
  }

  //关注的话题列表
  async listFollowingTopics(ctx){
    const user = await User.findById(ctx.params.id)
                           .select('+followingTopics')
                           .populate('followingTopics')
    if(!user){
      ctx.throw(404,'不存在')
    }
    ctx.body = user.followingTopics
 }

  async followTopic(ctx){
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    if(!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)){
      me.followingTopics.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }

  async unfollowTopic(ctx){
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me.followingTopics.splice(index,1)
      me.save()
    }
    ctx.status = 204
  }

  async checkOwner(ctx,next){
    if(ctx.params.id !== ctx.state.user._id){
        ctx.throw(403,'没有权限')
    }
    await next()
  }

  async listQuestions(ctx){
    const questions = await Question.find({questioner:ctx.params.id})
    ctx.body = questions
  }

  //答案

  async listLikingAnswers(ctx){
    const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers')
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user.likingAnswers
  }

  async likeAnswer(ctx,next){
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    if(!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)){
      me.likingAnswers.push(ctx.params.id)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
    }
    ctx.status = 204
    await next()
  }

  async unlikeAnswer(ctx){
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me.likingAnswers.splice(index,1)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:-1}})
    }
    ctx.status = 204
  }

  //点踩列表
  async listDislikingAnswers(ctx){
    const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers')
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user.dislikingAnswers
  }

  //点踩
  async dislikeAnswer(ctx,next){
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
    if(!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)){
      me.dislikingAnswers.push(ctx.params.id)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:-1}})
    }
    ctx.status = 204
    await next()
  }

  //取消点餐
  async undislikeAnswer(ctx){
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
    const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me.dislikingAnswers.splice(index,1)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
    }
    ctx.status = 204
  }

  //收藏
  async listCollectingAnswers(ctx){
    const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers')
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user.collectingAnswers
  }

  async collectAnswer(ctx,next){
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    if(!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)){
      me.collectingAnswers.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
    await next()
  }

  async uncollectAnswer(ctx){
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me.collectingAnswers.splice(index,1)
      me.save()
    }
    ctx.status = 204
  }
}

module.exports = new userController()
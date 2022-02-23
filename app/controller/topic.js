const Topic = require('../model/topic')
const User = require('../model/user')
const Question = require('../model/question')
const fieldHandle = require('../utils/fields')

class topicController{
  async find(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    ctx.body = await Topic.find({name:new RegExp(ctx.query.q)})
                          .limit(perPage)
                          .skip(page * perPage)
  }

  async checkTopicExist(ctx,next){
    const topic = await Topic.findById(ctx.params.id)
    if(!topic){
      ctx.throw(404,'该话题不存在')
    }
    ctx.state.topic = topic
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const topic = await Topic.findById(ctx.params.id).select(fieldHandle(fields))
    ctx.body = topic
  }

  async create(ctx){
    ctx.verifyParams({
      name:{type:'string',required:true},
      avatar_url:{type:'string',required:false},
      introduction:{type:'string',required:false}
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }

  async update(ctx){
    console.log(ctx.params.id,ctx.request.body);
    ctx.verifyParams({
      name:{type:'string',required:false},
      avatar_url:{type:'string',required:false},
      introduction:{type:'string',required:false}
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    ctx.body = topic
  }

  //获取粉丝列表
  async listFollowers(ctx){
    const users = await User.find({followingTopics:ctx.params.id})
    ctx.body = users
  }

  async listQuestions(ctx){
    const questions = await Question.find({topics:ctx.params.id})
    ctx.body = questions
  }
}

module.exports = new topicController()
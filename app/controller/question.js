const Question = require('../model/question')
const User = require('../controller/user')
const user = require('../model/user')

class questionController{
  async find(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Question.find({$or:[{title:q},{description:q}]})
                             .limit(perPage)
                             .skip(page * perPage)
  }

  async checkQuestionExist(ctx,next){
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if(!question){
      ctx.throw(404,'该问题不存在')
    }
    ctx.state.question = question
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const question = await Question.findById(ctx.params.id).select(fieldHandle(fields)).populate('questioner topics')
    ctx.body = question
  }

  async create(ctx){
    ctx.vertifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:false},
      questioner:{type:'string',required:true}
    })
    const question = await new Question({...ctx.request.body,questioner:ctx.state.user._id}).save()
    ctx.body = question
  }

  async update(ctx){
    ctx.vertifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:false},  
    })
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }

  async checkQuestioner(ctx,next){
    const {question} = ctx.state;
    if(question.questioner.toString() !== user.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }
  
  async delete(ctx){
    await Question.findByIdAndRemove(ctx.params.id)
    ctx.state = 204
 }
}

module.exports = new questionController()
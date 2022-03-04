const Question = require('../model/question')
const User = require('../model/user')
const fieldHandle = require('../utils/fields')
class questionController{
  async find(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    let {q} = ctx.query
    let reg = new RegExp(/[A-Za-z0-9]+/)
    if(reg.test(q) && q.length === 24){
      ctx.body = await Question.find({topics:q})
                               .populate('holder topics')
                               .limit(perPage)
                               .skip(page * perPage)
    }else{
      q = new RegExp(q)
      ctx.body = await Question.find({$or:[{title:q},{description:q}]})
                               .populate('holder topics')
                               .limit(perPage)
                               .skip(page * perPage)
    }

  }

  async checkQuestionExist(ctx,next){
    const question = await Question.findById(ctx.params.id).select('+holder')
    if(!question){
      ctx.throw(404,'该问题不存在')
    }
    ctx.state.question = question
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const question = await Question.findById(ctx.params.id).select(fieldHandle(fields)).populate('holder topics')
    await Question.findByIdAndUpdate(ctx.params.id,{$inc:{viewCount:1}})
    ctx.body = question
  }

  async create(ctx){
    ctx.verifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:false},
    })
    const question = await new Question({...ctx.request.body,holder:ctx.state.user._id}).save()
    ctx.body = question
  }

  async update(ctx){
    ctx.verifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:false},  
    })
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }

  async checkholder(ctx,next){
    const {question} = ctx.state;
    if(question.holder.toString() !== user.state.user._id){
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
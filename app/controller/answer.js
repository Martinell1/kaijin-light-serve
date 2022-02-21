const Answer = require('../model/answer')
const User = require('../controller/user')
const user = require('../model/user')

class answerController{
  async find(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Answer.find({content:q,questionId:ctx.params.questionId})
                             .limit(perPage)
                             .skip(page * perPage)
  }

  async checkAnswerExist(ctx,next){
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if(!answer){
      ctx.throw(404,'该答案不存在')
    //只有删改查的时候检查此逻辑，赞和踩的时候不调用
    }else if(ctx.params.questionId && answer.questionId !== ctx.params.questionId){
      ctx.throw(404,'该答案不存在')
    }
    ctx.state.answer = answer
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const answer = await Answer.findById(ctx.params.id).select(fieldHandle(fields)).populate('answerer')
    ctx.body = answer
  }

  async create(ctx){
    ctx.vertifyParams({
      content:{type:'string',required:true},
      answerer:{type:'string',required:true}
    })
    const answer = await new Answer({
      ...ctx.request.body,
      answerer:ctx.state.user._id,
      questionId:ctx.params.questionId
    }).save()
    ctx.body = answer
  }

  async update(ctx){
    ctx.vertifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:false},  
    })
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }

  async checkAnswerer(ctx,next){
    const {answer} = ctx.state;
    if(answer.answerer.toString() !== user.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }
  
  async delete(ctx){
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.state = 204
 }
}

module.exports = new answerController()
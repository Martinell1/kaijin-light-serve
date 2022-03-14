const Answer = require('../model/answer')
const User = require('../controller/user')
const user = require('../model/user')
const fieldHandle = require('../utils/fields')
class answerController{
  async find(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Answer.find({content:q,question:ctx.params.questionId})
                             .limit(perPage)
                             .skip(page * perPage)
                             .populate('holder')
  }

  async total(ctx,next){
    const articles = await Article.find()
    ctx.body = articles.length
  }

  async checkAnswerExist(ctx,next){
    const answer = await Answer.findById(ctx.params.id).select('+holder')
    if(!answer){
      ctx.throw(404,'该答案不存在')
    //只有删改查的时候检查此逻辑，赞和踩的时候不调用
    }else if(ctx.params.questionId && answer.question !== ctx.params.questionId){
      ctx.throw(404,'该答案不存在')
    }
    ctx.state.answer = answer
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const answer = await Answer.findById(ctx.params.id).select(fieldHandle(fields)).populate('holder')
    ctx.body = answer
  }

  async create(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true},
    })
    const answer = await new Answer({
      ...ctx.request.body,
      holder:ctx.state.user._id,
      question:ctx.params.questionId
    }).save()
    ctx.body = answer
  }

  async update(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true},
    })
    await ctx.state.answer.updateOne(ctx.request.body)
    ctx.body = ctx.state.answer
  }

  async checkholder(ctx,next){
    const {answer} = ctx.state;
    if(answer.holder.toString() !== ctx.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }
  
  async delete(ctx){
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.body = '删除成功'
 }
}

module.exports = new answerController()
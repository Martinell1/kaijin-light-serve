const Talk = require('../model/talk')
const User = require('../model/user')
const fieldHandle = require('../utils/fields')

class talkController{
  async find(ctx){
    const {per_page,rootTalkId} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    const q = new RegExp(ctx.query.q)
    const {articleId} = ctx.params
    ctx.body = await Talk.find({content:q,articleId,rootTalkId})
                         .limit(perPage)
                         .skip(page * perPage)
                         .populate('holder replyTo')
  }

  async checkTalkExist(ctx,next){
    const talk = await Talk.findById(ctx.params.id).select('+holder')
    if(!talk){
      ctx.throw(404,'该讨论不存在')
    }else if(ctx.params.articleId && talk.articleId !== ctx.params.articleId){
      ctx.throw(404,'该文章下没有此讨论')
    }
    ctx.state.talk = talk
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const talk = await Talk.findById(ctx.params.id).select(fieldHandle(fields)).populate('holder')
    ctx.body = talk
  }

  async create(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true},
      rootTalkId:{type:'string',required:false},
      replyTo:{type:'string',required:false},
    })
    const {articleId} = ctx.params
    const talk = await new Talk({
      ...ctx.request.body,
      holder:ctx.state.user._id,
      articleId,
    }).save()
    ctx.body = talk
  }

  async update(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true}
    })
    const {content} = ctx.request.body
    await ctx.state.talk.update({content})
    ctx.body = ctx.state.talk
  }

  async checkholder(ctx,next){
    const {talk} = ctx.state;
    if(talk.holder.toString() !== ctx.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }
  
  async delete(ctx){
    await Talk.findByIdAndRemove(ctx.params.id)
    ctx.body = '删除成功'
 }
}

module.exports = new talkController()
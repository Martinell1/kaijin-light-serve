const Comment = require('../model/comment')
const User = require('../model/user')
const fieldHandle = require('../utils/fields')

class commentController{
  async find(ctx){
    const {per_page,rootCommentId} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    const q = new RegExp(ctx.query.q)
    const {questionId,answerId} = ctx.params
    ctx.body = await Comment.find({content:q,question:questionId,answerId,rootCommentId})
                            .limit(perPage)
                            .skip(page * perPage)
                            .populate('holder replyTo')
  }

  async checkCommentExist(ctx,next){
    const comment = await Comment.findById(ctx.params.id).select('+holder')
    if(!comment){
      ctx.throw(404,'该评论不存在')
    }else if(ctx.params.questionId && comment.questionId !== ctx.params.questionId){
      ctx.throw(404,'该问题下没有此评论')
    }else if(ctx.params.answerId && comment.answerId !== ctx.params.answerId){
      ctx.throw(404,'该答案下没有此评论')
    }
    ctx.state.comment = comment
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const comment = await Comment.findById(ctx.params.id).select(fieldHandle(fields)).populate('holder')
    ctx.body = comment
  }

  async create(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true},
      rootCommentId:{type:'string',required:false},
      replyTo:{type:'string',required:false},
    })
    const {questionId,answerId} = ctx.params
    const comment = await new Comment({
      ...ctx.request.body,
      holder:ctx.state.user._id,
      questionId,
      answerId
    }).save()
    ctx.body = comment
  }

  async update(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true}
    })
    const {content} = ctx.request.body
    await ctx.state.comment.update({content})
    ctx.body = ctx.state.comment
  }

  async checkCommenter(ctx,next){
    const {comment} = ctx.state;
    if(comment.holder.toString() !== ctx.state.user._id
    && ctx.state.user.role !== 'superadmin'
    && ctx.state.user.role !== 'admin'){
      ctx.throw(403,'没有权限')
    }
    await next()
  }
  
  async delete(ctx){
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.body = '删除成功'
 }
}

module.exports = new commentController()
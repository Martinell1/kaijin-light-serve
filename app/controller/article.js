const Article = require('../model/article')
const User = require('../model/user')
const fieldHandle = require('../utils/fields')
class articleController{
  async find(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Article.find({$or:[{title:q},{description:q},{content:q}]})
                             .limit(perPage)
                             .skip(page * perPage)
  }

  async checkArticleExist(ctx,next){
    const article = await Article.findById(ctx.params.id).select('+author')
    if(!article){
      ctx.throw(404,'该文章不存在')
    }
    ctx.state.article = article
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const article = await Article.findById(ctx.params.id).select(fieldHandle(fields)).populate('author topics')
    ctx.body = article
  }

  async create(ctx){
    ctx.verifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:true},
      content:{type:'string',required:true},
    })
    const article = await new Article({...ctx.request.body,author:ctx.state.user._id}).save()
    ctx.body = article
  }

  async update(ctx){
    ctx.verifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:true},
      content:{type:'string',required:true}, 
    })
    await ctx.state.article.update(ctx.request.body)
    ctx.body = ctx.state.article
  }

  async checkArticleer(ctx,next){
    const {article} = ctx.state;
    if(article.author.toString() !== user.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }
  
  async delete(ctx){
    await Article.findByIdAndRemove(ctx.params.id)
    ctx.state = 204
 }
}

module.exports = new articleController()
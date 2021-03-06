const Article = require('../model/article')
const User = require('../model/user')
const fieldHandle = require('../utils/fields')
class articleController{
  async find(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    let {q} = ctx.query
    let reg = new RegExp(/[A-Za-z0-9]+/)
    if(reg.test(q) && q?.length === 24){
      ctx.body = await Article.find({topics:q})
                              .populate('holder topics')
                              .limit(perPage)
                              .skip(page * perPage)
    }else{
      q = new RegExp(q)
      ctx.body = await Article.find({$or:[{title:q},{description:q},{content:q}]})
                               .populate('holder topics')
                               .limit(perPage)
                               .skip(page * perPage)
    }   
  }

  async total(ctx){
    const articles = await Article.find({news:false})
    ctx.body = articles.length
  }

  async hot(ctx){
    ctx.body = await Article.find()
                             .sort({'voteCount':-1})
                             .populate('holder topics')
                             .limit(10)
  }

  async recommand(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    ctx.body = await Article.find()
                            .populate('holder topics')
                            .limit(perPage)
                            .skip(page * perPage)
  }

  async following(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    const user = ctx.state.user
    const me = await User.findById(user._id).select('+followings')
    ctx.body = await Article.find({holder:{$in:me.followings}})
                           .populate('holder topics')
                           .limit(perPage)
                           .skip(page * perPage)
  }

  async checkArticleExist(ctx,next){
    const article = await Article.findById(ctx.params.id).select('+holder')
    if(!article){
      ctx.throw(404,'??????????????????')
    }
    ctx.state.article = article
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const article = await Article.findById(ctx.params.id).select(fieldHandle(fields)).populate('holder topics')
    await Article.findByIdAndUpdate(ctx.params.id,{$inc:{viewCount:1}})
    ctx.body = article
  }

  async create(ctx){
    ctx.verifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:true},
      content:{type:'string',required:true},
    })
    const article = await new Article({...ctx.request.body,holder:ctx.state.user._id}).save()
    ctx.body = article
  }

  async update(ctx){
    ctx.verifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:false},
      content:{type:'string',required:true}, 
    })
    const article = await Article.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    const newArticle = await Article.findById(ctx.params.id)
    ctx.body = newArticle
  }

  async checkArticleer(ctx,next){
    const {article} = ctx.state;
    if(article.holder.toString() !== user.state.user._id
    && ctx.state.user.role !== 'superadmin'
    && ctx.state.user.role !== 'admin'){
      ctx.throw(403,'????????????')
    }
    await next()
  }
  
  async delete(ctx){
    await Article.findByIdAndRemove(ctx.params.id)
    ctx.body = '????????????'
 }
}

module.exports = new articleController()
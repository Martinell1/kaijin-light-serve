const News = require('../model/news')
const fieldHandle = require('../utils/fields')
class newsController{
  async find(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    let {q} = ctx.query
    let reg = new RegExp(/[A-Za-z0-9]+/)
    if(reg.test(q) && q?.length === 24){
      ctx.body = await News.find({topics:q})
                              .sort([['_id', -1]])
                              .populate('topics')
                              .limit(perPage)
                              .skip(page * perPage)
                              
    }else{
      q = new RegExp(q)
      ctx.body = await News.find({$or:[{title:q},{description:q},{content:q}]})
                               .sort([['_id', -1]])
                               .populate('topics')
                               .limit(perPage)
                               .skip(page * perPage)
    }   
  }

  async total(ctx){
    const newss = await News.find({news:false})
    ctx.body = newss.length
  }

  async hot(ctx){
    ctx.body = await News.find()
                             .sort({'voteCount':-1})
                             .populate('topics')
                             .limit(10)
  }

  async checkNewsExist(ctx,next){
    const news = await News.findById(ctx.params.id)
    if(!news){
      ctx.throw(404,'该新闻不存在')
    }
    ctx.state.news = news
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const news = await News.findById(ctx.params.id).select(fieldHandle(fields)).populate('topics')
    await News.findByIdAndUpdate(ctx.params.id,{$inc:{viewCount:1}})
    ctx.body = news
  }

  async create(ctx){
    ctx.verifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:true},
      content:{type:'string',required:true},
    })
    const news = await new News(ctx.request.body).save()
    ctx.body = news
  }

  async update(ctx){
    ctx.verifyParams({
      title:{type:'string',required:true},
      description:{type:'string',required:false},
      content:{type:'string',required:true}, 
    })
    const news = await News.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    const newNews = await News.findById(ctx.params.id)
    ctx.body = newNews
  }

  async delete(ctx){
    await News.findByIdAndRemove(ctx.params.id)
    ctx.body = '删除成功'
 }
}

module.exports = new newsController()
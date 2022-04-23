const Resource = require('../model/resource')

class resourceController{
    async find(ctx){
      const {per_page} = ctx.query
      const page = Math.max(ctx.query.page * 1,1)-1
      const perPage = Math.max(per_page * 1,1)
      let {q} = ctx.query
      let reg = new RegExp(/[A-Za-z0-9]+/)
      if(reg.test(q) && q?.length === 24){
        ctx.body = await Resource.find({topics:q})
                                 .populate('holder topics')
                                 .limit(perPage)
                                 .skip(page * perPage)
      }else{
        q = new RegExp(q)
        const res = await Resource.find({$or:[{title:q},{description:q}]})
                                 .populate('holder topics')
                                 .limit(perPage)
                                 .skip(page * perPage)
                                 ctx.body = res
      }
    }

    async hot(ctx){
      ctx.body = await Resource.find()
                               .sort({'downloadCount':-1})
                               .populate('holder topics')
                               .limit(10)
    }

    async downloadResource(ctx){
      ctx.body = await Resource.findByIdAndUpdate(ctx.params.id,{$inc:{downloadCount:1}})

    }

    async checkResourceExist(ctx,next){
      const resource = await Resource.findById(ctx.params.id).select('+holder')
      if(!resource){
        ctx.throw(404,'该资源不存在')
      }
      ctx.state.resource = resource
      await next()
    }

    async findById(ctx){
      const resource = await Resource.findById(ctx.params.id)
      if(!resource){
        ctx.throw(404,'资源不存在')
      }
      ctx.body = resource
    }

    async create(ctx){
        const resource = await new Resource(ctx.request.body).save()
        ctx.body = resource
    }
    async update(ctx){
      const resource = await Resource.findByIdAndUpdate(ctx.params.id,ctx.request.body)
      ctx.body = resource
    }

    async del(ctx){
      await Resource.findByIdAndRemove(ctx.params.id)
      ctx.body = '删除成功'
   }
}

module.exports = new resourceController()
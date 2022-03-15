const Link = require('../model/link')

class linkController{
    async find(ctx){
        ctx.body = await Link.find()
    }

    async findById(ctx){
      const link = await Link.findById(ctx.params.id)
      if(!link){
        ctx.throw(404,'用户不存在')
      }
      ctx.body = link
    }

    async create(ctx){
        const link = await new Link(ctx.request.body).save()
        ctx.body = link
    }
    async update(ctx){
      const link = await Link.findByIdAndUpdate(ctx.params.id,ctx.request.body)
      ctx.body = link
    }

    async del(ctx){
        await Link.findByIdAndRemove(ctx.params.id)
        ctx.body = '删除成功'
     }

}

module.exports = new linkController()
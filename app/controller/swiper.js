const Swiper = require('../model/swiper')

class swiperController{
    async find(ctx){
        ctx.body = await Swiper.find()
    }

    async findById(ctx){
      const swiper = await Swiper.findById(ctx.params.id)
      if(!swiper){
        ctx.throw(404,'用户不存在')
      }
      ctx.body = swiper
    }

    async create(ctx){
        const swiper = await new Swiper(ctx.request.body).save()
        ctx.body = swiper
    }
    async update(ctx){
      const swiper = await Swiper.findByIdAndUpdate(ctx.params.id,ctx.request.body)
      ctx.body = swiper
    }
}

module.exports = new swiperController()
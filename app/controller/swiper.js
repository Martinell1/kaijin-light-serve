const Swiper = require('../model/swiper')

class swiperController{
    async find(ctx){
        ctx.body = await Swiper.find().limit(1)
    }
    async create(ctx){
        const swiper = await new Swiper(ctx.request.body).save()
        ctx.body = swiper
    }
    async update(ctx){
        const {content} = ctx.request.body
        await Swiper.updateOne({content})
        ctx.body = ctx.state.connfi
    }
}

module.exports = new swiperController()
const Moment = require('../model/moment')
const User = require('../model/user')
const fieldHandle = require('../utils/fields')
class momentController{
  async find(ctx){
    const {per_page,sortBy} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    ctx.body = await Moment.find()
                           .populate('holder')
                           .sort(sortBy==='voteCount'?{'voteCount':-1}:[['_id', -1]])
                           .limit(perPage)
                           .skip(page * perPage)

  }

  async total(ctx,next){
    const moments = await Moment.find()
    ctx.body = moments.length
  }

  async following(ctx){
    const {per_page} = ctx.query
    const page = Math.max(ctx.query.page * 1,1)-1
    const perPage = Math.max(per_page * 1,1)
    const user = ctx.state.user
    const me = await User.findById(user._id).select('+followings')
    const res = await Moment.find({holder:{$in:me.followings}})
                           .populate('holder')
                           .limit(perPage)
                           .skip(page * perPage)
                           console.log(res);
                           ctx.body = res
  }

  async hot(ctx,next){
    ctx.body = await Moment.find()
                           .sort({'voteCount':-1})
                           .populate('holder')
                           .limit(10)
  }

  async checkMomentExist(ctx,next){
    const moment = await Moment.findById(ctx.params.id).select('+holder')
    if(!moment){
      ctx.throw(404,'该问题不存在')
    }
    ctx.state.moment = moment
    await next()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const moment = await Moment.findById(ctx.params.id).select(fieldHandle(fields)).populate('holder')
    await Moment.findByIdAndUpdate(ctx.params.id,{$inc:{viewCount:1}})
    ctx.body = moment
  }

  async create(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true},
    })
    const moment = await new Moment({...ctx.request.body,holder:ctx.state.user._id}).save()
    ctx.body = moment
  }

  async update(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true},
    })
    await ctx.state.moment.update(ctx.request.body)
    ctx.body = ctx.state.moment
  }

  async checkholder(ctx,next){
    const {moment} = ctx.state;
    if(moment.holder.toString() !== user.state.user._id){
      ctx.throw(403,'没有权限')
    }
    await next()
  }
  
  async delete(ctx){
    await Moment.findByIdAndRemove(ctx.params.id)
    ctx.state = 204
 }
}

module.exports = new momentController()
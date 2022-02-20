const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/constance.js')
const user = require('../model/user.js')
const User = require('../model/user.js')
const fieldHandle = require('../utils/fields')

class userController{
  async find(ctx){
    ctx.body = await User.find()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const user = await User.findById(ctx.params.id).select(fieldHandle(fields))
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user
  }

  async create(ctx){
    ctx.verifyParams({
      account:{type:'string',required:true},
      password:{type:'string',required:true},
      nickname:{type:'string',required:true}
    })
    const body = ctx.request.body
    const {account} = body
    const repeatUser = await User.findOne({account})
    if(repeatUser){
      ctx.throw(409,'用户名已被占用')
    }
    const user = await new User(body).save()
    ctx.body = user
  }

  async update(ctx){
    ctx.verifyParams({
      account:{type:'string',required:true},
      password:{type:'string',required:true},
      nickname:{type:'string',required:true}
    })
    const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.body = user
  }

  async del(ctx){
    const user = await User.findByIdAndRemove(ctx.params.id)
    if(!user){
      ctx.throw(404,'用户不存在')
    }
    ctx.status = 204
  }

  async login(ctx){
    ctx.verifyParams({
      account:{type:'string',required:true},
      password:{type:'string',required:true}
    })
    const user = await User.findOne(ctx.request.body)
    if(!user){
      ctx.throw(401,'用户名或密码不正确')
    }
    const {_id} = user
    const token = jwt.sign({_id},SECRET,{expiresIn:'7d'})
    ctx.body = {token}
  }

  async listFollowing(ctx){
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if(!user){
      ctx.throw(404)
    }
    ctx.body = user.following
  }

  async listFollower(ctx){
     const users = await User.find({following:ctx.params.id})
     ctx.body = users
  }

  async checkUserExist(ctx,next){
    const user = await User.findById(ctx.params.id)
    if(!user){
      ctx.throw(404,'该用户不存在')
    }
    await next()
  }

  async follow(ctx){
    const me = await User.findById(ctx.state.user._id).select('+following')
    if(!me.following.map(id => id.toString()).includes(ctx.params.id)){
      me.following.push(ctx.params.id)
      me.save()
    }
  }

  async unfollow(ctx){
    const me = await User.findById(ctx.state.user._id).select('+following')
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me.following.splice(index,1)
      me.save()
    }
  }

  async checkOwner(ctx,next){
    if(ctx.params.id !== ctx.state.user._id){
        ctx.throw(403,'没有权限')
    }
    await next()
  }
}

module.exports = new userController()
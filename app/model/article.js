const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const articleSchema = new Schema({
  __v:{type:Number,select:false},
  title:{type:String,required:true},
  description:{type:String},
  content:{type:String},
  avatar_url:{type:String},
  author:{type:Schema.Types.ObjectId,ref:'User',required:true,select:false},
  topics:{
    type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
    select:false
  }
},{timesatamps:true})

module.exports = model('Article',articleSchema)
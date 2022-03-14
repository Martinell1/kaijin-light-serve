const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const newsSchema = new Schema({
  __v:{type:Number,select:false},
  title:{type:String,required:true},
  description:{type:String},
  content:{type:String},
  avatar_url:{type:String},
  topics:{
    type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
    select:false
  },
  voteCount:{type:Number,required:true,default:0},
  viewCount:{type:Number,required:true,default:0},
},{timesatamps:true})

module.exports = model('News',newsSchema)
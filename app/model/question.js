const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const questionSchema = new Schema({
  __v:{type:Number,select:false},
  title:{type:String,required:true},
  description:{type:String},
  avatar_url:{type:String},
  holder:{type:Schema.Types.ObjectId,ref:'User',required:true,select:false},
  topics:{
    type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
    select:false
  },
  voteCount:{type:Number,required:true,default:0}
},{timestamps:true})

module.exports = model('Question',questionSchema)
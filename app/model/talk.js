const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const talkSchema = new Schema({
  __v:{type:Number,select:false},
  content:{type:String,required:true},
  holder:{type:Schema.Types.ObjectId,ref:'User',required:true,select:false},
  articleId:{type:String,required:true},
  rootTalkId:{type:String},
  replyTo:{type:Schema.Types.ObjectId,ref:'User'},
  voteCount:{type:Number,required:true,default:0}
},{timestamps:true})

module.exports = model('Talk',talkSchema)
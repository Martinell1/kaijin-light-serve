const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const topicSchema = new Schema({
  __v:{type:Number,select:false},
  name:{type:String,required:true},
  avatar_url:{type:String},
  introduction:{type:String,select:false},
},{timestamps:true})

module.exports = model('Topic',topicSchema)
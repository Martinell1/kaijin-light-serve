const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const linkSchema = new Schema({
  __v:{type:Number,select:false},
  title:{type:String},
  description:{type:String},
  avatar_url:{type:String,required:true},
  url:{type:String,required:true},
},{timestamps:true})

module.exports = model('Link',linkSchema)
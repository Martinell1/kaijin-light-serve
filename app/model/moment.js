const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const momentSchema = new Schema({
  __v:{type:Number,select:false},
  content:{type:String,required:true},
  imgs:{type:Array,require:false,select:true},
  holder:{type:Schema.Types.ObjectId,ref:'User',required:true,select:false},
  voteCount:{type:Number,required:true,default:0},
},{timestamps:true})

module.exports = model('Moment',momentSchema)
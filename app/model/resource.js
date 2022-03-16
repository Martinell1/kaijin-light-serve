const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const resourceSchema = new Schema({
    __v:{type:Number,select:false},
    title:{type:String},
    description:{type:String},
    holder:{type:Schema.Types.ObjectId,ref:'User',required:true},
    type:{type:String},
    url:{type:String},
    downloadCount:{type:Number,default:0},
    topics:{
      type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
    },
},{timestamps:true})

module.exports = model('Resource',resourceSchema)
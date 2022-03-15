const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const swipergSchema = new Schema({
    __v:{type:Number,select:false},
    title:{type:String},
    description:{type:String},
    avatar_url:{type:String},
    url:{type:String}
},{timestamps:true})

module.exports = model('Swiperg',swipergSchema)
const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const swipergSchema = new Schema({
    __v:{type:Number,select:false},
    avatar_url:{type:String},
    url:{type:String},
    order:{type:Number}
},{timestamps:true})

module.exports = model('Swiperg',swipergSchema)
const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const userSchema = new Schema({
  __v:{type:Number,select:false},
  account:{type:String,required:true,select:false},
  nickname:{type:String,required:true},
  password:{type:String,required:true,select:false},
  avatar_url:{type:String},
  gender:{type:String,enum:['male','female'],default:'male',require},
  headline:{type:String},
  locations:{type:[{type:String}],select:false},
  employments:{
    type:[{
        company:{type:String},
        job:{type:String}
    }],
    select:false
  },
  education:{
    type:[{
      school:{type:String},
      major:{type:String},
      diploma:{type:Number,enum:[1,2,3,4,5]},
      entrance_year:{type:Number},
      graduation_year:{type:Number},
    }],
    select:false
  },
  following:{
    type:[{type:Schema.Types.ObjectId,ref:'User'}],
    select:false
  }
})

module.exports = model('User',userSchema)
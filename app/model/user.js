const mongoose = require('../config/mongoose')

const {model,Schema} = mongoose

const userSchema = new Schema({
  __v:{type:Number,select:false},
  account:{type:String,required:true,select:false},
  nickname:{type:String,required:true},
  password:{type:String,required:true,select:false},
  avatar_url:{type:String},
  gender:{type:String,enum:['male','female'],default:'male',required:true},
  headline:{type:String},
  employment:{
    type:[{
        company:{type:String},
        job:{type:String},
    }],
    select:false
  },
  education:{
    type:[{
      school:{type:String},
      major:{type:String},
    }],
    select:false
  },
  followings:{
    type:[{type:Schema.Types.ObjectId,ref:'User'}],
  },
  followingTopics:{
    type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
    select:false
  },
  followingArticles:{
    type:[{type:Schema.Types.ObjectId,ref:'Article'}],
    select:false
  },
  followingQuestions:{
    type:[{type:Schema.Types.ObjectId,ref:'Question'}],
    select:false
  },
  followingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}],
    select:false
  },
  likingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}],
    select:false
  },
  likingQuestions:{
    type:[{type:Schema.Types.ObjectId,ref:'Questions'}],
    select:false
  },
  likingArticles:{
    type:[{type:Schema.Types.ObjectId,ref:'Article'}],
    select:false
  },
  likingComments:{
    type:[{type:Schema.Types.ObjectId,ref:'Comment'}],
    select:false
  },
  likingTalks:{
    type:[{type:Schema.Types.ObjectId,ref:'Talk'}],
    select:false
  },
  likingMoments:{
    type:[{type:Schema.Types.ObjectId,ref:'Moment'}],
    select:false
  }
},{timestamps:true})

module.exports = model('User',userSchema)
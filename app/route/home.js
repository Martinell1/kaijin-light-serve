const {SECRET} = require('../config/constance')
const jwt = require('koa-jwt')
const auth = jwt({secret:SECRET})
const {accessKey,secretKey,bucket} = require("../config/qiniu")
const qiniu = require('qiniu')

const Router = require("koa-router");
const router = new Router({prefix:'/home'})

const uploadImage = async ctx =>{
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  const options = {
    scope: bucket,
    expires: 7200
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  if(uploadToken){
    console.log('token',uploadToken);
    ctx.body = uploadToken
  }
}


router.post('/uploadImage',auth,uploadImage) //
module.exports = router
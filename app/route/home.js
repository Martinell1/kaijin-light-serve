const {SECRET} = require('../config/constance')
const jwt = require('koa-jwt')
const auth = jwt({secret:SECRET})
const {accessKey,secretKey,bucket} = require("../config/qiniu")
const fs = require('fs');
const path = require('path')
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
    ctx.body = uploadToken
  }
}

const uploadResource = async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, './static/') + `/${file.name}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  const result = file.path.split('\\')
  return ctx.body = 'http://localhost:3001/'+ result[result.length-1];
}

router.post('/uploadImage',auth,uploadImage) //

router.post('/uploadFile',auth, uploadResource);

module.exports = router
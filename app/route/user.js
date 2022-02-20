const jwt = require('koa-jwt')
const Router = require("koa-router");
const router = new Router({prefix:'/user'})
const {SECRET} = require('../config/constance')

const {checkOwner,find,create,update,findById,del,login,listFollowing,listFollower,checkUserExist,follow,unfollow} = require('../controller/user')
const auth = jwt({secret:SECRET})

router.get('/',find)

router.post('/',create)

router.patch('/:id',auth,checkOwner,update)

router.get('/:id',findById)

router.delete('/:id',auth,checkOwner,del)

router.post('/login',login)

router.get('/:id/following',listFollowing)

router.get('/:id/follower',listFollower)

router.put('/following/:id',auth,checkUserExist,follow)

router.delete('/following/:id',auth,checkUserExist,unfollow)

module.exports = router
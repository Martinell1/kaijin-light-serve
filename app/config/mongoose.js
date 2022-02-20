const mongoose = require('mongoose')
const {MONGODB_CONFIG} = require('./constance')
mongoose
  .connect(`mongodb://${MONGODB_CONFIG.username}:${MONGODB_CONFIG.password}@${MONGODB_CONFIG.ip}:${MONGODB_CONFIG.port}/${MONGODB_CONFIG.database}`)
  .then(() => console.log("MongoDB Connect Succeed"))
  .catch((err) => console.log(err))

module.exports = mongoose;
const jwt = require('jsonwebtoken')
const authkeyword = require('./tokenkeyword')

module.exports=(payload)=>{
    return jwt.sign(payload, authkeyword.toString(), {expiresIn:60})
}
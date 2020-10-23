const crypto = require('crypto');
const passkeyword = require('./passkeyword')

module.exports=(password)=>{
    let keyword = passkeyword.toString()
    return crypto.createHmac('sha256',keyword).update(password).digest('hex')
}
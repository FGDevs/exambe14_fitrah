const cryptoRandomString = require("crypto-random-string");

module.exports=()=>{
    let keyword = cryptoRandomString()
    console.log('token key ='+keyword)
    return keyword
}
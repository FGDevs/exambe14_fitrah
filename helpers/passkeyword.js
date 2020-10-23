const cryptoRandomString = require("crypto-random-string");

module.exports=()=>{
    let keyword = cryptoRandomString({length: 10})
    console.log('pass key ='+keyword)
    return keyword
}
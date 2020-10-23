const jwt = require('jsonwebtoken')
const authkeyword = require('./tokenkeyword')

module.exports = (req,res,next) => {
    if(req.method !== "OPTIONS"){
        console.log(req.token);
        jwt.verify(req.token, authkeyword.toString(), (error,decoded) => {
            if(error) return res.status(401).json({
                message :"User not authorized",
                error   :"User not authorized"
            });
            console.log(decoded,'Ini decode');
            req.user=decoded;
            next();
        });
    }else{
        next();
    };
};
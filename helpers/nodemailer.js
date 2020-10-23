const nodemailer = require('nodemailer') // to call nodemailer lib

module.exports = nodemailer.createTransport({ 
    service:'gmail',
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
        },
    tls:{
        rejectUnauthorized:false
    } 
})


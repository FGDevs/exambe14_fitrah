const authorization = require('./authorization');
const encrypt = require('./encrypt');

module.exports = {
    transporter     : require('./nodemailer'),
    encrypt         : require('./encrypt'),
    otp             : require('./otpgenerator'),
    authorization   : require('./authorization'),
    createJWTToken  : require('./jwt')
};
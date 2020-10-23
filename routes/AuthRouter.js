const Router = require('express').Router();
const { AuthController } = require('../controllers');

Router.post('/otp', AuthController.requestOTP )
// Router.get('/allusers', AuthController.getalluser )
// Router.post('/register', AuthController.register )
// Router.post('/login', AuthController.login )
// Router.post('/requestotp', AuthController.requestOTP )
// Router.post('/verifotp', AuthController.verifOTP )



module.exports = Router;
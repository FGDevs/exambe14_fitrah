const Router = require('express').Router();
const { AuthController } = require('../controllers');

Router.get( '/allusers' , AuthController.getalluser )


module.exports = Router;
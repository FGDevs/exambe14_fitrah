const Router = require('express').Router();
const { ProductController } = require('../controllers');

Router.get('/best6', ProductController.bestProduct);

module.exports = Router;
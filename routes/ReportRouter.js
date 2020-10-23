const Router = require('express').Router();
const { ReportController } = require('../controllers');

Router.get('/pendapatan', ReportController.pendapatan);
Router.get('/penjualterbaik', ReportController.penjualTerbaik);
Router.get('/categoryterbaik', ReportController.categoryTerbaik);
Router.get('/totaluser', ReportController.totalUser);

module.exports = Router;
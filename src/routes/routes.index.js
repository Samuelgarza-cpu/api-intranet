const { Router } = require('express');
const routes = Router();
const { saveToken } = require('../controllers/requisiciones.controller')


routes.post('/save', saveToken)


module.exports = routes;
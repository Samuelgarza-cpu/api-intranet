const { Router } = require('express');
const routes = Router();
const { saveToken, getAvisos, InsertarAvisos, saveUsuario,getUsuario } = require('../controllers/requisiciones.controller')


routes.post('/save', saveToken)
routes.post('/usuario', saveUsuario)
routes.post('/aviso', InsertarAvisos)
routes.get('/getavisos', getAvisos)
routes.post('/getUsuario', getUsuario)


module.exports = routes;
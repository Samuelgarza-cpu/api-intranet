const { Router } = require('express');
const routes = Router();
const multer = require('multer');
const { saveToken, getAvisos, InsertarAvisos, saveUsuario,getUsuario,saveImagen } = require('../controllers/requisiciones.controller')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/public')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
  
const upload = multer({storage})
routes.post('/save', saveToken)
routes.post('/usuario', saveUsuario)
routes.post('/aviso', InsertarAvisos)
routes.post('/saveImagen/:id',upload.single('imagen'), saveImagen)
routes.get('/getavisos', getAvisos)
routes.post('/getUsuario', getUsuario)


module.exports = routes;
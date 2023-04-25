const { createPool } = require('mysql2/promise');
const webpush = require('web-push');
const moment = require('moment');


const pool = createPool({
    host: 'manada.digital',
    user: 'u787062733_admin',
    password: 'Admin2910',
    database: 'u787062733_intranet'
    // port: 3306

    // host: 'localhost',
    // user: 'sa',
    // password: '2910',
    // database: 'intranet'
})

async function getAvisos(req, res) {
    try {
        const [results] = await pool.query("select * from avisos  order by idAvisos desc ");
        results.forEach(element => {
            element.Fecha_Aviso = moment(element.Fecha_Aviso).format('L');
        });
        res.json(results)
    } catch {
        res.json([0])
    }
}

async function InsertarAvisos(req, res) {
    try {

        const { titulo, descripcion, archivo, fecha } = req.body
        const [result] = await pool.query(`INSERT INTO avisos (Titulo,Descripcion,Imagen,Fecha_Aviso) VALUES (?,?,?,?)`, [titulo, descripcion, archivo, fecha])
        if (result.affectedRows > 0) {
            const [results] = await pool.query('SELECT * FROM tokens')

            results.forEach(element => {
                element.expirationTime = null
                enviarNotificacion(element)
            });

            res.json({ "code": 1, "idIsert": result.insertId })
        }

    } catch (err) {
        console.log(err);
        res.json('0')
    }

}

const vapidKeys = { "publicKey": "BFBvncHQOrM2_1F-Pb567krxlF9V8aZSMRRxX3UvMPxmfzJHTEWiY3LASbrAi5wJWnGrGYn-5poFaP_uTEbKYnA", "privateKey": "DizhINsoXTrqFIKKkY8hMq5R_2kohvPG640Fbmb4X1M" }

webpush.setVapidDetails(
    'mailto:samuel.garza29@hotmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const payload = {
    "notification": {
        "title": "INTRANET",
        "body": "SE A PUBLICADO UNA NOTICIA",
        "vibrate": [100, 50, 100],
        "image": "/public/login.png",
        "click_action": "www.youtube.com",
        "url": "www.google.com"

    }
}

async function enviarNotificacion(dataIn) {
    try {

        const jsonEnviar = {
            "endpoint": dataIn.endpoint,
            "expirationTime": dataIn.expirationTime,
            "keys": {
                "auth": dataIn.auth,
                "p256dh": dataIn.p256dh
            }

        }

        const datosentrada = jsonEnviar;

        let respuestaData = 0;
        const resultado = await webpush.sendNotification(
            datosentrada,
            JSON.stringify(payload))
        if (resultado.statusCode == 201) {
            respuestaData = 1
        }
        return respuestaData

    } catch (err) {

        console.log(err)
    }

}
async function saveToken(req, res) {
    try {
        const { endpoint, keys, idUser } = req.body
        const fechahoy = moment().format('YYYY-MM-DD');


        const [existeU] = await pool.query("select * from tokens where endpoint = ? and p256dh = ? and auth = ?", [endpoint, keys.p256dh, keys.auth])


        if (existeU.length >= 1) {
            res.json({ "mensaje": "Ya esta ese token registrado" })

        } else {
            const [result] = await pool.query(`INSERT INTO tokens (endpoint,p256dh,auth,idusuarios,fecha_alta) VALUES (?,?,?,?,?)`, [endpoint, keys.p256dh, keys.auth, idUser, fechahoy])
            if (result.affectedRows > 0) {
                res.json({ "mensaje": "Recivido" });
            } else {
                res.json({ "mensaje": "Nada que Insertar" })
            }

        }
    } catch (err) {

        res.json({ "mensaje": err })

    }

}
async function saveUsuario(req, res) {
    try {



        const { Nombre, App, Apm, email, Nomina, password, Rol } = req.body
        const fechahoy = moment().format('YYYY-MM-DD');


        const [existeU] = await pool.query('select * from usuarios where Correo = ?', [email])

        if (existeU.length > 0) {
            res.json(3)

        } else {

            const [result] = await pool.query(`INSERT INTO usuarios (Nombre,App,Apm,Correo,Nomina,Fecha_Alta,idroles,Pass) VALUES (?,?,?,?,?,?,?,?)`, [Nombre, App, Apm, email, Nomina, fechahoy, Rol, password])

            if (result.affectedRows > 0) {
                res.json(1);
            } else {
                res.json(2)
            }
        }
    } catch (err) {

        res.json({ "mensaje": err })

    }

}

async function getUsuario(req, res) {
    try {
        const { email, password } = req.body

        const [results] = await pool.query('SELECT * FROM usuarios where correo = ? and Pass = ?', [email, password])

        res.json(results)
    } catch {
        res.json([0])
    }

}

async function saveImagen(req, res) {

    const { id } = req.params
    const nombreImagen = req.file.originalname
    try {

        const [result] = await pool.query(`UPDATE avisos SET Imagen =? WHERE idAvisos = ?`, [nombreImagen, id])

        if (result.affectedRows > 0) {
            res.json(1);
        } else {
            res.json(0)
        }
    } catch (err) {

        res.json(err);

    }





}




module.exports = { saveToken, getAvisos, InsertarAvisos, saveUsuario, getUsuario, saveImagen }

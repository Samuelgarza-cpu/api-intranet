const { createPool } = require('mysql2/promise');
const webpush = require('web-push');


const vapidKeys = { "publicKey": "BFBvncHQOrM2_1F-Pb567krxlF9V8aZSMRRxX3UvMPxmfzJHTEWiY3LASbrAi5wJWnGrGYn-5poFaP_uTEbKYnA", "privateKey": "DizhINsoXTrqFIKKkY8hMq5R_2kohvPG640Fbmb4X1M" }

webpush.setVapidDetails(
    'mailto:samuel.garza29@hotmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const payload = {
    "notification": {
        "title": "HOLA NESTOR",
        "body": "YA ESTOY ENVIANDO MENSAJES",
        "vibrate": [100, 50, 100],
        "image": "https://w7.pngwing.com/pngs/533/966/png-transparent-computer-icons-user-login-casual-logo-monochrome-silhouette.png",
        "actions": [{
            "action": "windows.location.href= www.youtube.com",
            "title": "jajaj"
        }]

    }
}

async function enviarNotificacion(dataIn) {
    const datosentrada = JSON.parse(dataIn);
    let respuestaData = 0;
    const resultado = await webpush.sendNotification(
       datosentrada,
        JSON.stringify(payload))
    if (resultado.statusCode == 201) {
        respuestaData = 1
    }

    console.log(resultado)

    return respuestaData


}
const pool = createPool({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'imm',
    // port: 3306

    host: '162.241.2.112',
    user: 'gruposav_imm',
    password: 'Admin2910*',
    database: 'gruposav_imm'
})


async function saveToken(req, res) {
    try {
        const respuesta = await enviarNotificacion(req.body)
        if (respuesta == 1) {
            res.json({ "mensaje": "Recivido" });
        } else {
            return res.json({ "mensaje": "Error" })
        }
    } catch (err) {

        res.json({ "mensaje": err })

    }

}




module.exports = { saveToken }

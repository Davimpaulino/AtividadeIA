/* =====================================================
   CONFIGURAÇÃO FIREBASE REALTIME DATABASE (OPCIONAL)

   O Firebase só é usado quando as duas variáveis de
   ambiente abaixo estiverem definidas (ex.: no Render):

   FIREBASE_SERVICE_ACCOUNT -> conteúdo do JSON da conta de serviço
   FIREBASE_DATABASE_URL    -> https://SEU-BANCO-default-rtdb.firebaseio.com/

   Sem elas, a aplicação usa o arquivo data/clientes.json.
===================================================== */

function conectarFirebase() {
    const conta = process.env.FIREBASE_SERVICE_ACCOUNT;
    const databaseURL = process.env.FIREBASE_DATABASE_URL;

    if (!conta || !databaseURL) return null;

    const admin = require("firebase-admin");

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(conta)),
            databaseURL
        });
    }

    return admin.database();
}

module.exports = conectarFirebase();

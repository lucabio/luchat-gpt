const express = require('express');
const AWS = require('aws-sdk');
const { getConnection } = require('../persistence/dbConnectionPool');
const router = express.Router();

AWS.config.update({ region: process.env.AWS_REGION });
const cognito = new AWS.CognitoIdentityServiceProvider();

// const dbConfig = {
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     server: process.env.DB_SERVER,
//     database: process.env.DB_NAME,
//     port: 1433,
//     options: {
//         trustServerCertificate: true
//     }
// };

router.post('/create-admin', async (req, res) => {
    const { username, password, email } = req.body;

    // Crea un nuovo utente in Cognito
    const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        UserAttributes: [
            { Name: 'email', Value: email }
        ],
        TemporaryPassword: password
    };

    try {
        const cognitoUser = await cognito.adminCreateUser(params).promise();

        // Connettiti al DB e aggiungi l'utente e i ruoli
        const pool = getConnection();
        //const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            // Inserisci l'utente nel database
            let insertUser = `INSERT INTO Users (CognitoUserID, Email) VALUES ('${cognitoUser.User.Username}', '${email}');`;
            await transaction.request().query(insertUser);

            // Assumi che l'ID del ruolo di amministratore sia noto o recuperato dal DB
            let adminRoleId = 1; // Sostituisci con il metodo appropriato per ottenere l'ID del ruolo
            let insertUserRole = `INSERT INTO UserRoles (CognitoUserID, RoleID) VALUES ('${cognitoUser.User.Username}', ${adminRoleId});`;
            await transaction.request().query(insertUserRole);

            await transaction.commit();
            res.status(200).json({ message: 'Utente amministratore creato con successo', cognitoUser });
        } catch (err) {
            await transaction.rollback();
            res.status(500).json({ error: 'Errore durante la scrittura nel database', details: err.message });
        }

    } catch (err) {
        res.status(500).json({ error: 'Errore durante la creazione dell\'utente in Cognito', details: err.message });
    }
});

module.exports = router;

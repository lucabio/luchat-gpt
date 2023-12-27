const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const { decodeCognitoToken } = require('../utils/utility');

const checkToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send('Access Denied. Token not provided.');
    }

    try {

        const decodedToken = decodeCognitoToken(token.replace('Bearer ', ''));
        const currentTime = Date.now() / 1000; // tempo corrente in secondi

        if (decodedToken.exp < currentTime) {
            // Il token è scaduto
            return res.status(401).json({
                message: 'Token expired. Please refresh your token.',
                refreshTokenUrl: '/auth/refresh-token'
            });
        }

        // Verifica il token con Cognito
        AWS.config.update({ region: process.env.AWS_REGION });
        const cognito = new AWS.CognitoIdentityServiceProvider();
        const params = {
            AccessToken: token.replace('Bearer ', '')
        };

        await cognito.getUser(params, (err, data) => {
            if (err) {
                console.error("Cognito Error:", err);
                return res.status(401).send('Access Denied. Token not valid.');
            } else {
                req.user = data; // Salva i dettagli dell'utente nella richiesta
                next(); // Passa al prossimo middleware/route
            }
        });
    } catch (error) {
        res.status(400).send('Token not valid.');
    }
};

module.exports = checkToken;

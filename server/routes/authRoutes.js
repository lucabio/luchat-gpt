const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const { decodeCognitoToken } = require('../utils/utility');
const { saveTokens, getRefreshToken } = require('../persistence/dbOperations');

const router = express.Router();

router.get('/login', (req, res) => {
    const cognitoUrl = process.env.COGNITO_HOSTED_UI;
    //res.redirect(cognitoUrl);
    res.send(cognitoUrl);
});

router.get('/cognito/callback', async (req, res) => {
    const code = req.query.code;
    
    const clientURL = process.env.CLIENT_APP_URL; // Sostituisci con l'URL effettivo del tuo front-end
    res.redirect(`${clientURL}/auth-callback?code=${code}`);    
});



router.post('/authenticate', async (req, res) => {
    console.log(`authenticate ${req.body}`);
    const code = req.body.code;

    const clientId = process.env.COGNITO_CLIENT_ID;
    //const clientSecret = process.env.COGNITO_CLIENT_SECRET; // Se utilizzato
    const redirectUri = process.env.COGNITO_REDIRECT_URI; // Modifica con il tuo URI di reindirizzamento

    const tokenUrl = process.env.COGNITO_OAUTH2_URL;
    //const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64'); // non serve, non utilizzato ma lascio come reference

    try {
        const response = await axios.post(tokenUrl, querystring.stringify({
            grant_type: 'authorization_code',
            client_id: clientId,
            redirect_uri: redirectUri,
            code: code
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                //'Authorization': `Basic ${authString}`
            }
        });
        
        const tokens = response.data;

        const decodedToken = decodeCognitoToken(tokens.id_token);
        const cognitoUserID = decodedToken.sub;

        console.log('cognitoUserID', cognitoUserID);

        await saveTokens(tokens, cognitoUserID);

        res.send(tokens);

        //const clientURL = process.env.CLIENT_APP_URL; // Sostituisci con l'URL effettivo del tuo front-end
        //res.redirect(`${clientURL}/auth-callback?accessToken=${tokens.access_token}&idToken=${tokens.id_token}&refreshToken=${tokens.refresh_token}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/logout', (req, res) => {
    const cognitoLogoutUrl = process.env.COGNITO_HOSTED_UI_LOGOUT;
    res.redirect(cognitoLogoutUrl);
});

router.get('/refresh-token', async (req, res) => {

    const accessToken = req.headers['authorization']?.split(' ')[1];

    const decodedToken = decodeCognitoToken(accessToken);
    const cognitoUserID = decodedToken.sub;

    const refreshToken = await getRefreshToken(cognitoUserID);

    const clientId = process.env.COGNITO_CLIENT_ID;
    //const clientSecret = process.env.COGNITO_CLIENT_SECRET; // Se utilizzato
    const tokenUrl = process.env.COGNITO_OAUTH2_URL;
    //const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64'); // non serve, non utilizzato ma lascio come reference

    try {
        const response = await axios.post(tokenUrl, querystring.stringify({
            grant_type: 'refresh_token',
            client_id: clientId,
            refresh_token: refreshToken
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                //'Authorization': `Basic ${authString}`
            }
        });

        const tokens = response.data;

        await saveTokens(tokens, cognitoUserID);

        res.send(tokens);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
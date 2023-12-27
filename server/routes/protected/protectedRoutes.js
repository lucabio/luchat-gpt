const express = require('express');
const router = express.Router();

const checkToken = require('../../middleware/checkToken');

// Route for checking token validity
router.get('/protected/token-check', checkToken, (req, res) => {
    res.send('Benvenuto nella route protetta');
});

// router.get('/protected/get-access-token', (req, res) => {
//     const accessToken = req.cookies['accessToken'];
//     if (accessToken && isValidToken(accessToken)) {
//         res.send(accessToken);
//     } else {
//       res.sendStatus(401).send('Access token non valido');
//     }
//   });

module.exports = router;
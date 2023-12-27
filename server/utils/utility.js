const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { saveFile } = require('../persistence/dbOperations');
const multer = require('multer');
const { jwtDecode } = require('jwt-decode');



// Configura l'SDK di AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

async function generateBlobUrl(filePath, userId) {
  const fileContent = fs.readFileSync(filePath);
  const bucketName = process.env.AWS_S3_BUCKET;
  const fileName = path.basename(filePath);
  const s3Key = `${userId}/${Date.now()}_${fileName}`;

  const params = {
    Bucket: bucketName,
    Key: s3Key,
    Body: fileContent
  };

  try {
    const uploadResult = await s3.upload(params).promise();

    await saveFile(userId, uploadResult.Location);

    return uploadResult.Location;
  } catch (error) {
    console.error('Error during S3 upload:', error);
    throw error;
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      // Utilizza il nome originale del file, mantenendo l'estensione
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const decodeCognitoToken = (token) => {
  const decodedToken = jwtDecode(token);
  
  /**
   * {
      "sub": "407a465a-1797-471c-8a7f-02d208196b47",
      "iss": "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_WyVNvaEQW",
      "version": 2,
      "client_id": "2blafmlvvuvpnjq224dsvgct2v",
      "origin_jti": "7e245f01-162d-448f-be33-0e42d755e743",
      "token_use": "access",
      "scope": "aws.cognito.signin.user.admin phone openid profile email",
      "auth_time": 1701934770,
      "exp": 1701938370,
      "iat": 1701934770,
      "jti": "bb601cee-7262-4f8a-b6d7-bdd4379aa3d5",
      "username": "407a465a-1797-471c-8a7f-02d208196b47"
    }
   */
  return decodedToken;
}

module.exports = { generateBlobUrl, decodeCognitoToken, upload };

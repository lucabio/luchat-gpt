const { getConnection } = require('./dbConnectionPool');


async function saveFile(location, userId){
    try {
        const pool = await getConnection();
        const insertQuery = `INSERT INTO FileUploads (CognitoUserID, S3Url) VALUES ('${userId}', '${location}')`;
        const result = await pool.request().query(insertQuery);
        return result;
    } catch (error) {
        console.error('Errore during saving threads on DB:', error);
        throw error;
    }
};

async function saveThreads(threadsId, userId){
    try {
        const pool = await getConnection();
        const insertQuery = `INSERT INTO Threads (CognitoUserID, ThreadsId) VALUES ('${userId}', '${threadsId}')`;
        const result = await pool.request().query(insertQuery);
        return result;
    } catch (error) {
        console.error('Errore during saving threads on DB:', error);
        throw error;
    }
};
  
async function saveAssistants(assistantsId, userId){
    try {
        const pool = await getConnection();
        const insertQuery = `INSERT INTO Assistants (CognitoUserID, AssistantsId) VALUES ('${userId}', '${assistantsId}')`;
        const result = await pool.request().query(insertQuery);
        return result;
    } catch (error) {
        console.error('Errore during saving assistants on DB:', error);
        throw error;
    }
};
  
async function saveTokens(tokens, userId) {
    try {
        const pool = await getConnection();
        
        // Checking if record already exhists
        const checkQuery = `SELECT COUNT(*) as count FROM UserTokens WHERE CognitoUserID = '${userId}'`;
        const checkResult = await pool.request().query(checkQuery);

        if (checkResult.recordset[0].count > 0) {
            // If yes, execute UPDATE
            const updateQuery = `UPDATE UserTokens SET AccessToken = '${tokens.access_token}', RefreshToken = '${tokens.refresh_token}' WHERE CognitoUserID = '${userId}'`;
            await pool.request().query(updateQuery);
        } else {
            // No record -> INSERT
            const insertQuery = `INSERT INTO UserTokens (CognitoUserID, AccessToken, RefreshToken) VALUES ('${userId}', '${tokens.access_token}', '${tokens.refresh_token}')`;
            await pool.request().query(insertQuery);
        }

        return { success: true };
    } catch (error) {
        console.error('Error during token saving on DB', error);
        throw error;
    }
};

async function getRefreshToken(userId){
    try {
        const pool = await getConnection();
        const query = `SELECT RefreshToken FROM UserTokens WHERE CognitoUserID = '${userId}'`;
        const result = await pool.request().query(query);
        return result;
    } catch (error) {
        console.error('Errore during getting refresh token from DB:', error);
        throw error;
    }
};


module.exports = { saveThreads, saveAssistants, saveTokens, saveFile, getRefreshToken };
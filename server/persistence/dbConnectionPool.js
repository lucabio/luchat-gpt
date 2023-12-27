const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        trustServerCertificate: true, // Solo per lo sviluppo, vedi note sotto
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

pool.on('error', err => {
    console.error('Errore di connessione al database:', err);
});

/**
 * Ottiene una connessione al pool. Assicurarsi di rilasciare la connessione dopo l'uso.
 */
async function getConnection() {
    await poolConnect; // Assicura che il pool sia stato creato
    return pool;
}

module.exports = {
    getConnection,
    sql
};

const mariadb = require('mariadb');

const connectionConfig = {
    host: 'localhost',
    user: 'usuario',
    password: '1234',
    database: 'catering',
    port: 3306,
    connectionLimi: 5
};

async function initialize() {
    let connection;
    try {
        connection = await mariadb.createConnection(connectionConfig);
        console.log('Conexión a la BD exitosa.')
        return connection;
    } catch (err) {
        console.error('Error conectando a la BD:', err.message);
        throw err;
    }
}

module.exports.initialize = initialize;

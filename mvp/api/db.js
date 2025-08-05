import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: 'ipv4.kosmidis.me',
    port: 33066,
    user: 'kgongakis22b',
    password: '1edc25b8',
    database: 'kgongakis22b_db1'
});

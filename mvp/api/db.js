import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: 'YOUR HOST',
    port: 33066,
    user: ' YOUR USERNAME ',
    password: ' YOUR PASSWORD ',
    database: ' YOUR DB NAME'
});

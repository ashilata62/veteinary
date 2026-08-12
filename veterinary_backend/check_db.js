require('dotenv').config();
const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.query('DESCRIBE clinics;');
        console.log("Clinics Table Schema:");
        console.table(rows);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
check();

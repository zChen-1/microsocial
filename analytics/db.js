const Database = require("better-sqlite3");
const db = new Database("./events.db");
module.exports.db = db;

// first time, or if we delete/reset events.db
db.exec(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        message TEXT,
        severity TEXT,
        time TEXT
    );`);


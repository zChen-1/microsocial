const Database = require("better-sqlite3");
const db = new Database("./users.db");
module.exports.db = db;

// first time, or if we delete/reset users.db
db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );`);
db.exec(`CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        refresh_token TEXT NOT NULL, 
        issued TEXT,
        expires TEXT
    )`);

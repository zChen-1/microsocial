const Database = require("better-sqlite3");
const db = new Database("./messages.db");
module.exports.db = db;


db.exec(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread TEXT NOT NULL,
        author TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT,
        read BOOL
    );`);

db.exec(`CREATE TABLE IF NOT EXISTS threads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_a TEXT NOT NULL,
        user_b TEXT NOT NULL,
        UNIQUE(user_a, user_b),
        UNIQUE(user_b, user_a)
    );`);

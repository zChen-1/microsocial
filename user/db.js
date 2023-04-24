const Database = require('better-sqlite3')
var db = new Database('./users.db')

// first time, or if we delete/reset users.db
db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password TEXT NOT NULL
    );`)
db.exec(`CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        refresh_token TEXT NOT NULL, 
        issued TEXT,
        expires TEXT
    )`)

// I have no idea why I had to do this. The get() is NOT defined in my DB for some reason. This polyfills it. BJM 4/15/23
db.get = (stmt, params) => {
  prep = db.prepare(stmt)
  results = prep.all(params)
  return results ? results[0] : undefined
}

module.exports.db = db

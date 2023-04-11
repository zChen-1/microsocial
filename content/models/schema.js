import { db } from "../db";

export const createDatabase = () => {
    // Just a sample schema for now
    db.exec(`CREATE TABLE IF NOT EXISTS post (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE,
        tag TEXT NOT NULL
    );`);

    db.exec(`CREATE TABLE IF NOT EXISTS comment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        date DATE,
        body VARCHAR
    );`);
}
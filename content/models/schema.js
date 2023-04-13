import { db } from "../db.js";

export const createDatabase = () => {
    // Just a sample schema for now
    // Keep info needed for a post
    db.exec(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        date DATE,
        tags TEXT NOT NULL,
        contents TEXT NOT NULL
    );`);
    
    // Keep info needed for a comment
    db.exec(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        body TEXT NOT NULL,
        date DATE
    );`);
    
    // keep track of # user like a post
    db.exec(`CREATE TABLE IF NOT EXISTS likesPost (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        post_id INTEGER
    );`);
    
    // Keep track of # user like a comment
    db.exec(`CREATE TABLE IF NOT EXISTS likesComment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        comment_id INTEGER
    );`)
    console.log("Tables created")
}
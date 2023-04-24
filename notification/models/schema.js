import { db } from "../db.js";

export const createDatabase = () => {
    db.exec(`CREATE TABLE IF NOT EXISTS notification (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_username TEXT NOT NULL,
        receiver_username TEXT NOT NULL,
        action TEXT NOT NULL,
        date TEXT NOT NULL,
        read BOOLEAN
    );`);

    db.exec(`CREATE TABLE IF NOT EXISTS user_notification (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        notification_id TEXT NOT NULL
    );`);

    console.log("Tables created")
}
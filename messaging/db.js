const Database = require('better-sqlite3');
const db = new Database('./messages.db');
module.exports.db = db;


db.exec(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread INTEGER NOT NULL,
        author INTEGER NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        lastedit INTEGER NOT NULL,
        read BOOL
    );`);

db.exec(`CREATE TABLE IF NOT EXISTS threads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_a INTEGER NOT NULL,
        user_b INTEGER NOT NULL
    );`);


let dummydata=false;
if(dummydata){
    // insert dummy threads
    db.exec(`INSERT INTO threads(user_a, user_b) VALUES(1,2);`);//1
    db.exec(`INSERT INTO threads(user_a, user_b) VALUES(2,2);`);//2
    db.exec(`INSERT INTO threads(user_a, user_b) VALUES(1,3);`);//3
    db.exec(`INSERT INTO threads(user_a, user_b) VALUES(2,3);`);//4
    db.exec(`INSERT INTO threads(user_a, user_b) VALUES(3,3);`);//5
    // insert dummy messages
    db.exec(`INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(1,1,'Hello I am user 1.','`+Date.now()+`','`+Date.now()+`',true);`);
    db.exec(`INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(1,2,'Hello user 1, I am user 2.','`+Date.now()+`','`+Date.now()+`',false);`);
    db.exec(`INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(4,2,'SYN','`+Date.now()+`','`+Date.now()+`',true);`);
    db.exec(`INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(4,3,'SYN+ACK','`+Date.now()+`','`+Date.now()+`',true);`);
    db.exec(`INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(4,2,'ACK','`+Date.now()+`','`+Date.now()+`',false);`);

    db.exec(`INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(2,2,'User 2 talking to themselves.','`+Date.now()+`','`+Date.now()+`',false);`);
    db.exec(`INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(5,3,'User 3 talking to themselves.','`+Date.now()+`','`+Date.now()+`',false);`);
    db.exec(`INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(5,3,'User 3 talking to themselves again.','`+Date.now()+`','`+Date.now()+`',false);`);

    
    db.exec(`INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(3,2,'User 2 asking to talk to 3','`+Date.now()+`','`+Date.now()+`',false);`);
}

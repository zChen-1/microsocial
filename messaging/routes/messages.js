const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');
var express = require('express');
var router = express.Router();
module.exports.router = router;

const {uri} = require("../common");
const {db} = require("../db");

/*
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread TEXT NOT NULL,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TEXT,
    read BOOL
    select * from messages;
1|1|/user/1|this is the message text, hey!|2023/4/17 13:00|false
2|1|/user/1|this is a respones, hey!|2023/4/17 13:01|false
sqlite> .schema
CREATE TABLE messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread TEXT NOT NULL,
        author TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT,
        read BOOL
    );
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE threads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_a TEXT NOT NULL,
        user_b TEXT NOT NULL,
        UNIQUE(user_a, user_b),
        UNIQUE(user_b, user_a)
    );

*/

router.get("/messages", (req, res) => {
  //const id = parseInt(req.params.id);
  stmt=db.prepare(`SELECT * FROM messages`);
  console.log(stmt);
  let messages = stmt.all();
  console.log(messages);

  if (messages.length < 1) {
    res.statusMessage = "No such messages";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  messages.uri = uri(`/message/${messages.id}`);
  res.json(messages);
});


router.get("/messages/:id", (req, res) => {
  let id = parseInt(req.params.id);
  if(isNaN(id)){
  }
  const stmt = db.prepare(`SELECT id, author FROM messages WHERE thread = ?`);
  console.log("id=",id);
  let messages = stmt.all([id]);
  console.log({messages});

  if (messages.length < 1) {
    res.statusMessage = "No such messages";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  //messages = messages[0];
  messages.uri = uri(`/messages/${messages.id}`);
  res.json(messages);
});

router.post("/messages/:thread_id", (req, res) => {
  const message = req.body;

  message.thread=req.thread_id;
  message.author = message.author.trim();
  message.text = message.timestamp.trim();
  message.read = false;
  message.timestamp = 'datetimestamp';//standardize format, generate timestamp/read timestamp

  const stmt = db.prepare("INSERT INTO messages(thread, author, text, timestamp, read) VALUES(?,?,?,?,?)");
  messages = stmt.all([id]);

  try {
    info = stmt.run([message.thread, message.author, message.text, message.timestamp, message.read]);
  } catch (err) {
    console.log("insert error: ", { err, info, messages });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  message = messages[0];
  message.uri = uri(`/message/${message.id}`);
  res.json(message);
});


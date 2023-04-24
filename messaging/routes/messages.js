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

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: retrieve all messages 
 *     description: Retrieves all messages ordered by thread, timestamp.
 *     operationId: GetMessages
 *     tags: [Messaging API]
 *     responses:
 *       200:
 *         description: A list of all message data
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/messages"
 *             example:
 *               [
 *                 {
 *                   "id": 1,
 *                   "thread": 1,
 *                   "author": 1,
 *                   "content": "Hello I am user 1.",
 *                   "timestamp": 1681943395437,
 *                   "lastedit": 1681943395437,
 *                   "read": 1
 *                 },
 *                 {
 *                   "id": 2,
 *                   "thread": 1,
 *                   "author": 2,
 *                   "content": "Hello user 1, I am user 2.",
 *                   "timestamp": 1681943395581,
 *                  "lastedit": 1681943395581,
 *                  "read": 0
 *                 },
 *                 {
 *                   "id": 6,
 *                   "thread": 2,
 *                   "author": 2,
 *                   "content": "User 2 talking to themselves.",
 *                   "timestamp": 1681943396135,
 *                   "lastedit": 1681943396135,
 *                   "read": 0
 *                 }
 *               ]
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No messages available" ]
 */
router.get("/messages", (req, res) => {
  stmt=db.prepare(`SELECT * FROM messages ORDER BY thread, timestamp`);
  let messages = stmt.all([]);
  //console.log("retrieved ",messages.length,"messages");

  if (messages.length < 1) {
    res.statusMessage = "No messages available";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  messages.uri = uri(`/messages/`);
  res.json(messages);
});

/**
 * @swagger
 * /messages/{thread_id}:
 *   get:
 *     summary: Retrieve all messages in a thread.
 *     description: Retrieves all messages in a thread.
 *     operationId: GetMessagesByThreadId
 *     tags: [Messaging API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: message id
 *         required: true
 *     responses:
 *       200:
 *         description: A list of all message data
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/messages"
 *             example:
 *               [
 *                 {
 *                   "id": 1,
 *                   "thread": 1,
 *                   "author": 1,
 *                   "content": "Hello I am user 1.",
 *                   "timestamp": 1681943395437,
 *                   "lastedit": 1681943395437,
 *                   "read": 1
 *                 },
 *                 {
 *                   "id": 2,
 *                   "thread": 1,
 *                   "author": 2,
 *                   "content": "Hello user 1, I am user 2.",
 *                   "timestamp": 1681943395581,
 *                   "lastedit": 1681943395581,
 *                   "read": 0
 *                 }
 *               ]
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No messages available" ]
 */
router.get("/messages/:thread_id", (req, res) => {
  let id = parseInt(req.params.thread_id);
  if(isNaN(id)){
      console.log("NaN id");
  }
  const stmt = db.prepare(`SELECT * FROM messages WHERE thread = ? ORDER BY timestamp`);//prepared statements do not like parameter passing
  console.log("id=",id);
  let messages = stmt.all([id]);
  console.log({messages});

  if (messages.length < 1) {
    res.statusMessage = "No such threads";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  //messages = messages[0];
  messages.uri = uri(`/messages/${messages.id}`);
  res.json(messages);
});

/**
 * @swagger
 * /messages/{thread_id}:
 *   post:
 *     summary: Create a new message
 *     description: Creates a new message by a thread id.
 *     operationId: PostMessageByThreadId
 *     tags: [Messaging API]
 *     parameters:
 *       - in: path
 *         name: thread_id
 *         description: thread id
 *         required: true
 *       - in: body
 *         name: author
 *         description: author id
 *         required: true
 *       - in: body
 *         name: content
 *         description: contents of the message
 *         required: true
 *     responses:
 *       200:
 *         description: Message Data
 *         content:
 *           application/json:
 *             schema:
 *               "$ref": "#/components/schemas/messages"
 *             example:
 *               {
 *                 "id": 1,
 *                 "author": 1,
 *                 "timestamp": 1681943395437,
 *                 "content": "Hello I am user 1, and I just posted this message.",
 *                 "uri": "/message/1"
 *               }
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No thread available" ]
 */
router.post("/messages/:thread_id", (req, res) => {
  let message={};
  //console.log({req});
  message.thread=parseInt(req.params.thread_id);
  console.log("thread",message.thread);
  message.author = parseInt(req.body.author.trim());
  message.content = req.body.content.trim();
  message.read = 0;
  let current_time = Date.now();
  message.timestamp = current_time;
  message.lastedit = current_time;

  const stmt = db.prepare("INSERT INTO messages(thread, author, content, timestamp, lastedit, read) VALUES(?,?,?,?,?,?)");

  let info={};
  try {
    info = stmt.run([message.thread, message.author, message.content, message.timestamp, message.lastedit, message.read]);
  } catch (err) {
    console.log("insert error: ", { err, info, message });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  //console.log({info});

  message.uri = uri(`/message/${info.lastInsertRowid}`);
  res.json(message);
});

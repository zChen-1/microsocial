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
 * /message/{id}:
 *   get:
 *     summary: retrieve all messages 
 *     description: Retrieves all messages
 *     operationId: DelMessageById
 *     tags: [messaging API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: message id
 *         required: true
 *     responses:
 *       200:
 *         description: Message Data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetrievedMessage'
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No messages available" ]
 */
router.get("/messages", (req, res) => {
  stmt=db.prepare(`SELECT * FROM messages ORDER BY thread, timestamp`);
  let messages = stmt.all([]);
  console.log(messages);

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
 * /message/{thread_id}:
 *   get:
 *     summary: retrieve all messages 
 *     description: Retrieves all messages
 *     operationId: DelMessageById
 *     tags: [Messaging API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: message id
 *         required: true
 *             schema: integer
 *     responses:
 *       200:
 *         description: Message Data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetrievedMessage'
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
 * /message/{thread_id}:
 *   post:
 *     summary: Create a new message
 *     description: Creates a new message by a thread id.
 *     operationId: PostMessageByThreadId
 *     tags: [messaging API]
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
 *               $ref: '#/components/schemas/RetrievedMessage'
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

  message.uri = uri(`/message/${info.id}`);
  res.json(message);
});

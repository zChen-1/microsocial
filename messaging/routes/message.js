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
 *     summary: Retrieve a single message by id
 *     description: Retrieve one message by id
 *     operationId: GetMessageById
 *     tags: [Messaging API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: message id
 *         required: true
 *         schema:
 *            $ref: '#/components/schemas/messages'
 *     responses:
 *       200:
 *         description: Message Data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/messages'
 *             example:
 *               {
 *                 "id": 1,
 *                 "author": 1,
 *                 "timestamp": 1681943395437,
 *                 "content": "Hello I am user 1.",
 *                 "uri": "http://localhost:8003/message/1"
 *               }
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No such message" ]
 */
router.get("/message/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const stmt = db.prepare("SELECT id,author,timestamp,content FROM messages where id = ?");
  message = stmt.all([id]);

  if (message.length < 1) {
    res.statusMessage = "No such message";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  message = message[0];
  message.uri = uri(`/message/${message.id}`);
  res.json(message);
});

/**
 * @swagger
 * /message/{id}:
 *   delete:
 *     summary: Delete a single message
 *     description: Delete one message by id.
 *     operationId: DelMessageById
 *     tags: [Messaging API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: message id
 *         required: true
 *         schema:
 *            $ref: '#/components/schemas/messages'
 *     responses:
 *       200:
 *         description: The Message has been removed
 *         content:
 *           application/json:
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No such message" ]
 */
router.delete("/message/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Verify and Assert user.id==author.id
  // const stmt = db.prepare("DELETE * FROM message WHERE id=? AND author=?");
  // Should include a 403 if the author does not own that message
    // ...or just claim the message doesn't exist

  const stmt = db.prepare("DELETE * FROM message WHERE id=?");
  messages = stmt.all([id]);

  if (messages.length < 1) {
    res.statusMessage = "No such message";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  //messages = messages[0];
  //messages.uri = uri(`/messages/${message.id}`);
  res.json(message);
});
/**
 * @swagger
 * /message/{id}:
 *   put:
 *     summary: update a messages
 *     description: Updates a message's content by message id and touches the lastedit date
 *     operationId: putMessageById
 *     tags: [Messaging API]
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
 *         examples: [ "Not Found", "No message available" ]
 */
router.put("/message/:thread_id", (req, res) => {
  const message = req.body;

  message.thread=req.thread_id;
  message.author = message.author.trim();
  message.content = message.content.trim();
  message.read = false;
  let current_time = Date.now();
  message.timestamp = current_time;
  message.lastedit = current_time;

  const stmt = db.prepare("INSERT INTO messages( content, lastedit, read) VALUES(?,?,?)");
  messages = stmt.all([id]);

  try {
    info = stmt.run([message.thread, message.author, message.content, message.timestamp, message.lastedit, message.read]);
  } catch (err) {
    console.log("insert error: ", { err, info, messages });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  message = messages[0];
  message.uri = uri(`/message/${message.id}`);
  res.json(message);
});

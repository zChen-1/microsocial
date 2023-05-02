const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');
var express = require('express');
var bleach = require('bleach');
var router = express.Router();
module.exports.router = router;

const {uri} = require("../common");
const {db} = require("../db");
const {notifyUsers, createEvent} = require('../service_calls');

/**
 * @swagger
 * /message/{id}:
 *   get:
 *     summary: Retrieve a single message by id
 *     description: Retrieve one message by id
 *     operationId: GetMessageByMessageId
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
 *               $ref: '#/components/schemas/messages'
 *             example:
 *               {
 *                 "id": 1,
 *                 "author": 1,
 *                 "timestamp": 1681943395437,
 *                 "content": "Hello I am user 1.",
 *                 "uri": "/message/1"
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

  createEvent(
    type="Messages => GetMessageByMessageId",
    severity="info",
    message=`Retrieved message id=${message.id}`
  )
});

/**
 * @swagger
 * /message/{message_id}:
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
 *     responses:
 *       200:
 *         description: The Message has been removed
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No such message" ]
 */
router.delete("/message/:message_id", (req, res) => {
  let id = parseInt(req.params.message_id);
  if(isNaN(id)){
      console.log("failed to parse in id=",id);
      res.statusMessage = "No such message";
      res.status(StatusCodes.NOT_FOUND).end();
      return;
  }
  const msgexists= db.prepare("SELECT id FROM messages WHERE id=?");
  let found=msgexists.all([id]);
  if(found.length===0){
      res.statusMessage = "No such message";
      res.status(StatusCodes.NOT_FOUND).end();
      return;
  }
  //TODO: Verify and Assert user.id==author.id
  // const stmt = db.prepare("DELETE * FROM message WHERE id=? AND author=?");
  // Should include a 403 if the author does not own that message
    // ...or just claim the message doesn't exist

  const stmt = db.prepare("DELETE FROM messages WHERE id=?");
  stmt.run([id]);

  //TODO: actually verify deletion

  res.statusMessage ="Message Deleted";
  res.status(StatusCodes.OK).end();

  createEvent(
    type="Messages => DelMessageById",
    severity="info",
    message=`Deleted message id=${id}`
  )
});


/**
 * @swagger
 * /message/{message_id}:
 *   put:
 *     summary: update a messages
 *     description: Updates a message's content by message id and touches the lastedit date
 *     operationId: PutMessageByMessageId
 *     tags: [Messaging API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: message id
 *         required: true
 *       - in: body
 *         name: content
 *         description: Updated message text.
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
 *                 "content": "Hello I am user 1, and I updated this message",
 *                 "uri": "/message/1"
 *               }
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No message available" ]
 */
router.put("/message/:message_id", (req, res) => {
  let messageId = req.params.message_id.trim();
  let content = req.body.content;//.trim();
  content = bleach.sanitize(content);
  //TODO: should check for valid author as well
  let getstmt = db.prepare(`SELECT id, thread, author, timestamp, content FROM messages where id = ?`);
  message=getstmt.all([messageId])[0];
  message.content = content;
  let current_time = Date.now();
  message.lastedit = current_time;

  const stmt = db.prepare(`UPDATE messages SET content=?,lastedit=? WHERE id=?`);

  let info={};
  try {
    info = stmt.run([message.content, message.lastedit,message.id]);
  } catch (err) {
    console.log("insert error: ", { err, info, message });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  res.json(message);
  createEvent(
    type="Messages => PutMessageByMessageId",
    severity="info",
    message=`Updated message id=${message.id} content.length=${message.content.length}`
  )
});

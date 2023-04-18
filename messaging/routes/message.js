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

router.get("/message/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const stmt = db.prepare("SELECT id,author,timestamp,text FROM messages where id = ?");
  message = stmt.all([id]);

  if (message.length < 1) {
    res.statusMessage = "No such message";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  message = messages[0];
  message.uri = uri(`/message/${message.id}`);
  res.json(message);
});

router.delete("/message/:message_id", (req, res) => {
  const id = parseInt(req.params.id);

  const stmt = db.prepare("DELETE * FROM message WHERE id=?");
  messages = stmt.all([id]);

  if (messages.length < 1) {
    res.statusMessage = "No such message";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  messages = messages[0];
  messages.uri = uri(`/messages/${message.id}`);
  res.json(message);
});


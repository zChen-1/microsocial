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



router.get("/threads/:user_id", (req, res) => {
  const id = parseInt(req.params.id);

  const stmt = db.prepare("SELECT id FROM threads WHERE user_a=? OR user_b=?");
  threads = stmt.all([id]);

  if (threads.length < 1) {
    res.statusMessage = "No threads found";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  //TODO: fix packagaging
  threads.uri = uri(`/messages/${tid}`);
  res.json(threads);
});

router.post("/threads", (req, res) => {
  const thread = req.body;

  thread.user_a = thread.user_a.trim();
  thread.user_b = thread.user_b.trim();
  // Check with users to see if uri's are valid
  let users_are_valid=true;
  if (
      users_are_valid
  ) {
    res.statusMessage = "One or more users does not exist";
    res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
    return;
  }

  // Check with relationship to see if users are blocked
  let not_blocked=true;
  if (
      not_blocked
  ) {
    res.statusMessage = "This user has blocked you";
    res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
    return;
  }

  const stmt = db.prepare(`INSERT INTO threads (user_a, user_b)
                 VALUES (?, ?)`);

  try {
    info = stmt.run([thread.user_a, thread.user_b]);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Thread already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("insert error: ", { err, info, user });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  // we're just returning what they submitted.
  thread.id = info.lastInsertRowid;
  thread.uri = uri(`/messages/${thread.id}`);

  res.set('Location',thread.uri);
  res.type('json');
  res.json(thread);
  res.status(StatusCodes.CREATED);
});

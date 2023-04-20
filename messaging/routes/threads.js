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
 * /threads:
 *   get:
 *     summary: retrieve all threads by userid
 *     description: Retrieves all available to user by id
 *     operationId: GetThreadsById
 *     tags: [messaging API]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: user id
 *         required: true
 *     responses:
 *       200:
 *         description: {/user/id : /messages/thread_id}
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetrievedThread'
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No threads found" ]
 */
router.get("/threads/:user_id", (req, res) => {
  const id = parseInt(req.params.user_id);

  const stmt = db.prepare("SELECT id,user_a,user_b FROM threads WHERE user_a=? OR user_b=?");
  threads = stmt.all([id,id]);
  //console.log({threads});

  if (threads.length < 1) {
    res.statusMessage = "No threads found";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  function not_me(me,user_a,user_b){
      if(me===user_a){return user_b;}
      else if(me===user_b){return user_a;}
  }
  let messages={};
  threads.forEach(element => messages[`/user/${not_me(id,element.user_a,element.user_b)}`]=`/messages/${element.id}`);
  res.json(messages);
});

/**
 * @swagger
 * /threads:
 *   post:
 *     summary: post new thread 
 *     description: Post new thread
 *     operationId: PostNewThread
 *     tags: [messaging API]
 *     parameters:
 *       - in: body
 *         name: user_a
 *         description: user id
 *         required: true
 *       - in: body
 *         name: user_b
 *         description: user id
 *         required: true
 *     responses:
 *       200:
 *         description: Message Data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetrievedThread'
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No threads found" ]
 */

router.post("/threads", (req, res) => {
  let thread={};
  thread.user_a = req.body.user_a.trim();
  thread.user_b = req.body.user_b.trim();
  //console.log({thread});
  // Check with users to see if uri's are valid
  let users_are_invalid=false;
  if (
      users_are_invalid
  ) {
    res.statusMessage = "One or more users does not exist";
    res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
    return;
  }

  // Check with relationship to see if users are blocked
  let blocked=false;
  if (
      blocked
  ) {
    res.statusMessage = "This user has blocked you";
    res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
    return;
  }

  let stmt = db.prepare(`INSERT INTO threads(user_a, user_b)
                 VALUES(?, ?)`);
  let info={};
  try {
      //console.log(thread.user_a,thread.user_b);
     info = stmt.run([thread.user_a, thread.user_b]);
    //console.log('info',{info});
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

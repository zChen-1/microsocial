const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');
var express = require('express');
var router = express.Router();
module.exports.router = router;

const { uri,fetch } = require('../common')
const {db} = require("../db");
const {notifyUsersNewMessage,
    notifyUsersNewThread,
    isBlocked,
    createEvent} = require('../service_calls');

/**
 * @swagger
 * /threads/{user_id}:
 *   get:
 *     summary: retrieve all threads by userid
 *     description: Retrieves all threads available to user by id
 *     operationId: GetThreadsById
 *     tags: [Messaging API]
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
 *             example:
 *               {
 *                 "/user/2": "/messages/1",
 *                 "/user/3": "/messages/3"
 *               }
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No threads found" ]
 */
router.get("/threads/:user_id", (req, res) => {
  const id = parseInt(req.params.user_id);

  const stmt = db.prepare("SELECT id,user_a,user_b FROM threads WHERE user_a=? OR user_b=?");
  threads = stmt.all([id,id]);

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
  //TODO: expand this routine as it only provides the latest threads per comunication
    // As part of the above, we should restructure to a multi-list pair
    // ex:[[usera]:[/messages/1, /messages/5], [usera, userb, userc]:[/messages/2] ]
  threads.forEach(element => messages[`/user/${not_me(id,element.user_a,element.user_b)}`]=`/messages/${element.id}`);
  res.json(messages);
  createEvent(
      type="Messages => GetThreadsByID",
      severity="info",
      message=`Fetched thread id="${id}"`
  )
});

/**
 * @swagger
 * /threads:
 *   post:
 *     summary: post new thread 
 *     description: Post new thread between two users
 *     operationId: PostNewThread
 *     tags: [Messaging API]
 *     parameters:
 *       - in: body
 *         name: users
 *         description: pair list of user id's
 *         required: true
 *         example: users=[1,2]
 *     responses:
 *       200:
 *         description: Thread Data
 *         content: 
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/threads'
 *             example:
 *               {
 *                 "users": [1,2],
 *                 "id": 1,
 *                 "uri": "/messages/1"
 *               }
 *       404:
 *         description: No such Message
 *         examples: [ "Not Found", "No threads found" ]
 */
router.post("/threads", (req, res) => {
  let thread={};
  let users=JSON.parse(req.body.users);//test with regex to make sure this the correct object
  if(users.length!=2){
      res.statusMessage = "incompatible number of users";
      res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
      return;
  }
  let user_a = users[0];
  let user_b = users[1];

  //TODO: Check with users to see if uri's are valid
  let users_are_invalid=false;
  if (
      users_are_invalid
  ) {
    res.statusMessage = "One or more users does not exist";
    res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
    return;
  }

  // Check with relationship to see if users are blocked
  /*
  if (
      isBlocked(users)
  ) {
    res.statusMessage = "This user has blocked you";
    res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
    return;
  }
  */
  console.log("fine up to here");

  let stmt = db.prepare(`INSERT INTO threads(user_a, user_b)
                 VALUES(?, ?)`);
  let info={};
  try {
      //console.log(thread.user_a,thread.user_b);
     info = stmt.run([user_a, user_b]);
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
  thread.users=[user_a,user_b];
  
  res.set('Location',thread.uri);
  res.type('json');
  res.json(thread);
  res.status(StatusCodes.CREATED);

  notifyUsersNewThread(thread.users);
  createEvent(
      type="Messages => PostNewThread",
      severity="info",
      message=`New thread id=${thread.id} users=${thread.users}`
  )
});

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
 * /user/{id}:
 *   get:
 *     summary: Retrieve a User
 *     description: Retrieve one User by id.
 *     operationId: GetUserById
 *     tags: [Users API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: user id
 *         required: true
 *         schema:
 *            $ref: '#/components/schemas/UserId'
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetrievedUser'
 *       404:
 *         description: Service/URI not found
 *         examples: [ "Not Found", "No such user" ]
 *       500:
 *          description: Internal server error
 */
router.get("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const stmt = db.prepare("SELECT id,name FROM users where id = ?");
  users = stmt.all([id]);

  if (users.length < 1) {
    res.statusMessage = "No such user";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  user = users[0];
  user.uri = uri(`/user/${user.id}`);
  res.json(user);
});

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update User
 *     description: Replace all* fields for one User, by id.
 *     operationId: UpdateUserById
 *     tags: [Users API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user.
 *         schema:
 *            type: integer
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdatingUser'
 *     responses:
 *       200:
 *         description: User Updated (all fields)
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedUser'
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: Service/URI not found
 *          examples: [ "Not Found", "No such user" ]
 *       500:
 *          description: Internal server error
 */
router.put("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedUser = req.body;

  updatedName = updatedUser["name"] || "";
  updatedUser.name = updatedName.trim();
  if (
    updatedUser.name.length < 1 ||
    updatedUser.name.length > 32 ||
    updatedUser.name.match(/[^A-Za-z0-9_.-]/)
  ) {
    res.statusMessage = "Invalid name";
    res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
    return;
  }

  updatedPass = updatedUser["password"] || "";
  updatedUser.password = updatedPass.trim();
  if (updatedUser.password.length < 4) {
    res.statusMessage = "Invalid password";
    res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
    return;
  }

  const stmt = db.prepare(`UPDATE users SET name=?, password=? WHERE id=?`);

  try {
    info = stmt.run([updatedUser.name, updatedUser.password, id]);
    if (info.changes < 1) {
      console.log("update error1: ", { err, info, user });
      res.statusMessage = "Account update failed.";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account with name already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("update error2: ", { err, info, user });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  res.redirect(`${id}`).end();
});
      
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: (Partially) update User fields
 *     description: Replace any submitted fields for one User, by id.
 *     operationId: PatchUserById
 *     tags: [Users API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user.
 *         schema:
 *            type: integer
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PatchingUser'
 *     responses:
 *       200:
 *         description: User Updated (submitted fields only, but all fields returned)
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedUser'
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: Service/URI not found
 *          examples: [ "Not Found", "No such user" ]
 *       500:
 *          description: Internal server error
 */
router.patch("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedUser = req.body;
  try {

    if ("name" in updatedUser) {
      updatedName = updatedUser["name"] || "";
      updatedName = updatedName.trim();
      if (
        updatedName.length < 1 ||
        updatedName.length > 32 ||
        updatedName.match(/[^A-Za-z0-9_.-]/)
      ) {
        res.statusMessage = "Invalid name";
        res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
        return;
      }
      const stmt = db.prepare(`UPDATE users SET name=? WHERE id=?`);
  
      info = stmt.run([updatedName, id]);
      if ( info.changes < 1 ) {
        res.statusMessage = "No such user";
        res.status(StatusCodes.NOT_FOUND).end();
        return;
      }
    }
  
    if ("password" in updatedUser) {
      updatedPass = updatedUser["password"] || "";
      updatedUser.password = updatedPass.trim();
      if (updatedPass.length < 4) {
        res.statusMessage = "Invalid password";
        res.status(StatusCodes.UNPROCESSABLE_CONTENT).end();
        return;
      }
      const stmt = db.prepare(`UPDATE users SET password=? WHERE id=?`);
  
      info = stmt.run([updatedPass, id]);
      if ( info.changes < 1 ) {
        res.statusMessage = "No such user";
        res.status(StatusCodes.NOT_FOUND).end();
        return;
      }
    }
  
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account with name already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("update error: ", { err, info, user });
    res.status(500).end();
    return;
  }

  res.redirect(`${id}`);
});

/**
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete User
 *     description: Delete this user from the service
 *     operationId: DeleteUserById
 *     tags: [Users API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user.
 *         schema:
 *            type: integer
 *     responses:
 *       204:
 *         description: User Deleted
 *       404:
 *          description: Service/URI not found
 *          examples: [ "Not Found", "No such user" ]
 *       500:
 *          description: Internal server error
 */
router.delete("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const stmt = db.prepare("DELETE FROM users where id = ?");
  
  info = stmt.run([id]);
  if (info.changes < 1) {
    res.statusMessage = "No such user";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }
  res.status(StatusCodes.NO_CONTENT).end();
});

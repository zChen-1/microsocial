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
 *         description: foo
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
    res.status(404).end();
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
 *         description: User Updated
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: Service/URI not found
 *          examples: [ "Not Found", "No such user" ]
      500:
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
    res.status(400).end();
    return;
  }

  updatedPass = updatedUser["password"] || "";
  updatedUser.password = updatedPass.trim();
  if (updatedUser.password.length < 4) {
    res.statusMessage = "Invalid password";
    res.status(400).end();
    return;
  }

  const stmt = db.prepare(`UPDATE users SET name=?, password=? WHERE id=?`);

  info = { changes: 0 };
  try {
    info = stmt.run([updatedUser.name, updatedUser.password, id]);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account with name already exists";
      res.status(400).end();
      return;
    }
    console.log("update error: ", { err, info, user });
    res.status(500).end();
    return;
  }

  res.status(200).end();
});

/**
 *     operationId: DeleteUserById
 * 
 */
router.delete("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const stmt = db.prepare("DELETE FROM users where id = ?");
  info = stmt.run([id]);

  if (info.changes < 1) {
    res.statusMessage = "No such user";
    res.status(404).end();
    return;
  }
  res.status(200).end();
});

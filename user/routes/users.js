var express = require('express');
var router = express.Router();
module.exports.router = router;

const {uri} = require("../common");
const {db} = require("../db");


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve Users
 *     description: Retrieve Users, optionally filtering by query params
 *     operationId: GetUsers
 *     tags: [Users API]
 *     responses:
 *       200:
 *         description: Success - 0 or more Users returned
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                   $ref: '#/components/schemas/RetrievedUser'
 *       400:
 *         description: Invalid Query
 *       500:
 *         description: Server Error
 */
router.get("/users", (req, res) => {
  const stmt = db.prepare("SELECT id,name FROM users");
  users = stmt.all();
  users.forEach((user) => {
    user.uri = uri(`/user/${user.id}`);
  });
  res.json({ users: users });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create User
 *     description: Create a new User
 *     operationId: CreateUser
 *     tags: [Users API]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreatingUser'
 *     responses:
 *       201:
 *         description: User Created
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedUser'
 *         links:
 *            'Retrieving Users':
 *              operationId: GetUserById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `GET /user/{id}`.
 *            'Updating a User':
 *              operationId: UpdateUserById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `PUT /user/{id}`.
 *            'Deleting a User':
 *              operationId: DeleteUserById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `DEL /user/{id}`.
 *       400:
 *          description: User data is not acceptable
 *          examples: [ "Invalid user name", 
 *                "Invalid password", 
 *                "User with that name already exists" ]
 *       500:
 *          description: Internal server error
 */
router.post("/users", (req, res) => {
  const user = req.body;

  user.name = user.name.trim();
  if (
    user.name.length < 1 ||
    user.name.length > 32 ||
    user.name.match(/[^A-Za-z0-9_.-]/)
  ) {
    res.statusMessage = "Invalid username";
    res.status(400).end();
    return;
  }

  user.password = user.password.trim();
  if (user.password.length < 4) {
    res.statusMessage = "Invalid Password";
    res.status(400).end();
    return;
  }

  const stmt = db.prepare(`INSERT INTO users (name, password)
                 VALUES (?, ?)`);

  try {
    info = stmt.run([user.name, user.password]);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account already exists";
      res.status(400).end();
      return;
    }
    console.log("insert error: ", { err, info, user });
    res.status(500).end();
    return;
  }

  // we're just returning what they submitted. but we never return the password
  user.id = info.lastInsertRowid;
  user.uri = uri(`/user/${user.id}`);
  delete user.password;

  res.type('json');
  res.json(user);
  res.status(201);
});

const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const path = require('path');

const {db} = require("../db");

var express = require('express');
var router = express.Router();
module.exports.router = router;

function generateAccessToken(name) {
  return jwt.sign(name, "my-secret-garden", { expiresIn: '1800s' });
}

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Hello, World!
 *     description: Base page. Just says hello.
 *     operationId: base
 *     tags: [Auth API]
 *     responses:
 *       200:
 *         description: Boring Text
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.post("/auth/login", (req, res) => {
  const login_info = req.body;

  const stmt = db.prepare("SELECT id FROM users WHERE name = ? AND password = ?");
  users = stmt.all([login_info.user, login_info.password]);

  if (users.length == 0) {
    console.log("Failed login attempt",login_info);
    res.statusMessage = "Invalid login";
    res.status(StatusCodes.BAD_REQUEST).end();
    return;
  }

  console.log("Successful login",login_info);
  const token = generateAccessToken({ id: users[0].id });
  res.json({id: users[0].id, token});
  res.status(StatusCodes.OK);
});

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Sample login.html
 *     description: Base page. Just says hello.
 *     operationId: loginhtml
 *     tags: [Examples]
 *     responses:
 *       200:
 *         description: example form in html
 *         content:
 *           text/html:
 *             schema:
 *               type: html
 */
router.get("/auth/login", (req, res) => {
  const filename = "login.html";
  res.sendFile(filename, { root: path.join(__dirname) });
});


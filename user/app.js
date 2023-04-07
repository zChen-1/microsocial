const express = require("express");
const bodyParser = require("body-parser");
const Database = require("better-sqlite3");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// >>>>>>> Configure as needed
const Services = {
  Users: { port: 8000 },
  Content: { port: 8001 },
  Relationships: { port: 8002 },
  Messages: { port: 8003 },
  Notifications: { port: 8004 },
  Analytics: { port: 8005 },
};

const MY_SERVICE = "Users";
// <<<<<<<<<<<<<

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: `${MY_SERVICE} Service API`,
    description: "for Social!",
    version: "0.1.0",
  },
  contact: {
    name: "Bruce",
    email: "bjmckenz@gmail.com",
  },
  servers: [
    {
      url: `http://localhost:${Services[MY_SERVICE].port}`,
    },
  ],
};

/*
 * @function uri
 * Produce the URL/URI for a service
 * @param {string} [path=""] - If empty, returns the service URL
 * @param {string} [typ=(My Service)] - one of the service types, defaults to MY_SERVICE
 * @returns {string} a FQDN with no path, or with a path
 */
function uri(path = "", typ = MY_SERVICE) {
  const current_host = "localhost";
  const default_scheme = "http";

  if (!(typ in Services)) {
    throw new Error(`Service type '${typ}' not known.`);
  }
  host = Services[typ].host || current_host;
  port = Services[typ].port;
  scheme = Services[typ].scheme || default_scheme;

  return `${scheme}://${host}:${port}${path}`;
}

const swaggerOptions = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["../*/*.js", "../*.js"],
  servers: [
    {
      url: uri(),
      description: "Development server",
    },
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const db = new Database("./users.db");

// first time, or if we delete/reset users.db
db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );`);

const app = express();
app.set("title", "Microsocial Users API");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customSiteTitle: "API Doc", explorer: true })
);
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  next();
});

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: The auto-generated id of the book. Will be unique.
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Username that they log in with. Must be unique
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: Guess. No leading or trailing spaces. Never returned by an API.
 *         uri:
 *           type: string
 *           readOnly: true
 *           format: password
 *           description: URI to this object. Set by endpoint at creation.
 *       examples: [
 *         { id: 1, name: "alonzo", password: "lambda", uri: "http://lh:8/user/14" }
 *       ]
 */

/**
 * @swagger
 * /forward/{id}:
 *   get:
 *     summary: Dev example
 *     description: An example for developers showing how an API endpoint can consume the endpoint of a (different) service. This is not a real service, just a dev example. It hits itself, retrieving a user through the /user/{id} endpoint.
 *     tags: [Examples]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *          description: No such user
 *       500:
 *          description: Internal server error
 */
app.get("/forward/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const obj_uri = uri(`/user/${id}`, "Users");
  apiresult = await fetch(obj_uri, { method: "GET" });
  if (apiresult.status != 200) {
    console.error("api returned error:", {
      err: apiresult.status,
      message: apiresult.statusText,
    });
    res.status(404).end();
    return;
  }

  fetched_user = await apiresult.json();

  // now do something with it...

  res.type("json");
  res.json({ apiuser: fetched_user });
  res.status(200);
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Hello, World!
 *     description: Base page. Just says hello.
 *     tags: [Users API]
 *     responses:
 *       200:
 *         description: Boring Text
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get("/", (req, res) => {
  console.log({ base: req.hostname, query: req.query });
  res.send("Hello you!");
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve Users
 *     description: Retrieve Users, optionally filtering by query params
 *     tags: [Users API]
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *              $ref: '#/definitions/ArrayOfUsers'
 *       400:
 *         description: Invalid Query
 *       500:
 *         description: Server Error
 *   definitions:
 *      ArrayOfUsers:
 *        type: array
 *        items:
 *          - $ref: '#/components/schemas/User'
 */
app.get("/users", (req, res) => {
  const stmt = db.prepare("SELECT id,name FROM users");
  users = stmt.all();
  users.forEach((user) => {
    user.uri = uri(`/user/${user.id}`);
  });
  res.json({ users: users });
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a User
 *     description: Retrieve one User by id.
 *     tags: [Users API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user.
 *         schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *          description: No such user
 *       500:
 *          description: Internal server error
 */
app.get("/user/:id", (req, res) => {
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
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User Updated
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: No such user
 *       500:
 *          description: Internal server error
 */

app.put("/user/:id", (req, res) => {
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

app.delete("/user/:id", (req, res) => {
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

// Insert a user
app.post("/users", (req, res) => {
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

  res.status(201);
});

server = app.listen(Services[MY_SERVICE].port, () => {
  console.log("Listening on port " + Services[MY_SERVICE].port + "...");
});

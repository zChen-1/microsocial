const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the users database.");
});

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );`);

// Helper function to execute SQLite queries
function runQuery(query, params, callback) {
  db.run(query, params, function (err) {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else {
      console.log(`Query executed: ${query}`);
      callback(null, this.lastID);
    }
  });
}

// Get user by id
function getUserById(id, callback) {
  db.get("SELECT * FROM users WHERE id = ?", [id], function (err, row) {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else if (!row) {
      console.error(`User with id ${id} not found`);
      callback({ message: `User with id ${id} not found` }, null);
    } else {
      console.log(`Retrieved user with id ${id}`);
      callback(null, row);
    }
  });
}
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const USER_PORT = 8000;
const CONTENT_PORT = 8001;
const RELATIONSHIP_PORT = 8002;
const MESSAGING_PORT = 8003;
const NOTIFICATIONS_PORT = 8004;
const ANALYTICS_PORT = 8005;

const MY_PORT = USER_PORT;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// test path
app.get("/", (req, res) => {
  console.log({ base: req.hostname, query: req.query });
  res.send("Hello!");
});

// Basic api
app.get("/users", (req, res) => {
  var users = [];
  db.all("SELECT * FROM users", function (err, rows) {
    if (err) {
      console.error(err.message);
      res.status(500);
      return;
    }
    rows.forEach((row) => {
      console.log({row});
      user = { id: row.id, name: row.name };
      user.uri = "/user/" + user.id;
      users.push(user);
    });
    res.json({ users: users });
  });
});

app.get("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var user = {};
  db.get("SELECT * FROM users WHERE id = ?", [id], function (err, row) {
    if (err) {
      console.error(err.message);
      res.status(500);
      return;
    }
    if (row) {
      user = { id: row.id, name: row.name };
      user.uri = "/user/" + user.id;
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

app.post("/users", (req, res) => {
  const user = req.body;
  console.log({ user: user });

  // insert into db here

  // ****** show how an API can use another API
  const url = "http://" + req.hostname + ":" + USER_PORT + "/user/" + user.id;
  const options = {
    method: "GET",
  };

  fetch(url, options)
    .then((xres) => xres.json())
    .then((xjson) => {
      // Note this in here for THIS example
      res.json({ user: user, fromapi: xjson });
      console.log("got response from API", xjson);
    })
    .catch((err) => console.error("error:" + err));

  res.status(201);
});

// end api

app.listen(MY_PORT, () => {
  console.log("Listening on port " + MY_PORT + "...");
});

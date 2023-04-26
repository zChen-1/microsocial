"use strict"
const express = require("express");
const bodyParser = require("body-parser");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const USER_PORT = 8000;
const CONTENT_PORT = 8001;
const RELATIONSHIP_PORT = 8002;
const MESSAGING_PORT = 8003;
const NOTIFICATIONS_PORT = 8004;
const ANALYTICS_PORT = 8005;

const MY_PORT = MESSAGING_PORT;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// test path
app.get("/", (req, res) => {
  console.log({ base: req.hostname, query: req.query });
  res.send("Hello!");
});

// just data in variables for now
let messages= [
];

// Basic api
app.get("/messagings", (req, res) => {
  // get list of messagings (use query params as needed to filter)
  res.json(Users);
});

app.get("/messaging/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const messaging = Users.find((u) => u.id === id);
  if (messaging) {
    res.json(messaging);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/messagings", (req, res) => {
  const messaging = req.body;
  console.log({ messaging: user });

  messaging.id = Users.length + 1;
  messaging.uri = "/user/" + user.id;
  Users.push(messaging);

  // ****** show how an API can use another API
  const url = "http://" + req.hostname + ":" + USER_PORT + "/messaging/" + user.id;
  const options = {
    method: "GET",
  };

  fetch(url, options)
    .then((xres) => xres.json())
    .then((xjson) => {
      // Note this in here for THIS example
      res.json({ messaging: user, fromapi: xjson });
      console.log("got response from API", xjson);
    })
    .catch((err) => console.error("error:" + err));

  res.status(201);
});

app.get("/messaging", (req, res) => {
  // get list of messagings (use query params as needed to filter)
  res.json(Users);
});

// end api

app.listen(MY_PORT, () => {
  console.log("Listening on port " + MY_PORT + "...");
});

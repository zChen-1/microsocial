# microsocial
We're having some fun now!

Fork this, then clone that.

make a change, push to your fork, and file a PR (pull request) to this repo.

(If I don't see the PR instantly, say something chat, or text)

Please make the services live in a simply named directory (e.g. "user").

## Beginning your service (notes)
### Get User's / working
That will get you confident that your install is good.
### Create your new service dir
Under the root, say "foo" service
### Copy everything from user/ into your dir
Don't run yet.
**All subsequent comments are about your service. You should not have to touch/modify anything in the user folder**
cd into your directory
### tweak the project name in your package.json
### tweak common.js as needed
Don't run yet
### comment out all but base routes in app.js
```app.use("/", require("./routes/base").router);
// app.use("/", require("./routes/forward").router);
// app.use("/", require("./routes/users").router);
// app.use("/", require("./routes/user").router);
```

### tweak your base page in base.js
make it different

### now start your service
```node app.js```

### Profit!
You can create a new terminal in VS Code. cd into the user directory and run its service TOO.
```node app.js```
Now you're running both services simultaneously!


const express = require("express");
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const fs = require('fs');
const path = require('path');

const { uri, Services, MY_SERVICE } = require("./common");

// >>>>>>>>> set up api docs route 
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

const swaggerOptions = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["../*.js", "../*/*.js", "../*/routes/*.js"],
  servers: [
    {
      url: uri(),
      description: "Development server",
    },
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerUIOptions = {
  customSiteTitle: "API Doc",
  explorer: true,
  swaggerOptions: {
    layout: "StandaloneLayout",
    displayOperationId: true,
    docExpansion: "none",
  },
};
// <<<<<<<<<< all the options for /docs. registered below.

const app = express();
app.set("title", `Microsocial ${MY_SERVICE} API`);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
app.use(express.static("public"));
app.use(cookieParser())
app.use(helmet())
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUIOptions)
);
// if it's got JSON, don't allow invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, message: err.message }); // Bad request
  }
  next();
});

// include all routes from the routes/ dir: all js files.
fs.readdir("./routes", (err, files) => { 
  files.forEach(file => {
    if (file.match(/[.]js$/)) {
      console.log("including routes from:",file); 
      app.use("/", require(`./routes/${ path.basename(file,'.js') }`).router);
    } 
  })
});

// app.enableCors({
//   ...CorsConfig,
//   origin: '*',
//   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
// })
// app.enableVersioning()
// app.useGlobalInterceptors(new TimeoutInterceptor())

server = app.listen(Services[MY_SERVICE].port, () => {
  console.log("Listening on port " + Services[MY_SERVICE].port + "...");
});

const express = require("express");
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

const { uri, Services, MY_SERVICE } = require("./common");

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

const app = express();
app.set("title", "Microsocial Users API");
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
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  next();
});

app.use("/", require("./routes/base").router);
app.use("/", require("./routes/forward").router);
app.use("/", require("./routes/users").router);
app.use("/", require("./routes/user").router);

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

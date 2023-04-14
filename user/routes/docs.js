var express = require("express");
const stream = require('stream');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { Services, MY_SERVICE, uri } = require("../common");

var router = express.Router();
var app;

module.exports.appSetCallback = function (theApp) {
  app = theApp;
  app_setup();
};
module.exports.router = router;

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
// <<<<<<<<<< all the options for API browser


function app_setup() {
  /**
   * @swagger
   * /docs:
   *   get:
   *     summary: API Catalog as browseable site
   *     description: Swagger's browser. Lets you try out all the APIs. Does not pass authentication token though!
   *     operationId: apiCatalog
   *     tags: [Schema]
   *     responses:
   *       200:
   *         description: Active page of the catalog.
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUIOptions)
  );
}

/**
 * @swagger
 * /docs/api-doc:
 *   get:
 *     summary: API Spec
 *     description: Downloads the OAS 3.0 JSON spec for this API. Downloads as "api-doc.json"
 *     operationId: apiDoc
 *     tags: [Schema]
 *     responses:
 *       200:
 *         description: File Download of API. File is named api-doc.json.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.get('/docs/api-doc', function(req, res){
  const filename = "api-doc.json";
  var fileContents = Buffer.from(JSON.stringify(swaggerSpec), "base64");
  
  var readStream = new stream.PassThrough();
  readStream.end(fileContents);

  res.set('Content-disposition', `attachment; filename=${filename}`);
  res.set('Content-Type', 'application/octet-stream');

  readStream.pipe(res);
});

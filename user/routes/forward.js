var express = require('express');
var router = express.Router();
module.exports.router = router;

const {uri,fetch} = require("../common");

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
 *               $ref: '#/components/schemas/RetrievedUser'
 *       404:
 *          description: No such user
 *       500:
 *          description: Internal server error
 */
router.get("/forward/:id", async (req, res) => {
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



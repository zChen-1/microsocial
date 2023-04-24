const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode
} = require('http-status-codes')
var express = require('express')

var router = express.Router()
module.exports.router = router

const { uri } = require('../common')
const { db } = require('../db')
const { validate } = require('../utils/schema-validation')

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
 */
router.get('/users', (req, res) => {
  const base = 'SELECT id,name FROM users'
  where_clauses = []
  where_vals = []

  if ('id_GE' in req.query && parseInt(req.query.id_GE) !== NaN) {
    req.query.id_GE = parseInt(req.query.id_GE)
  }
  errors = validate.UserFilteringSpec(req.query, '{query param}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'Invalid data'
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
    return
  }

  if ('id_GE' in req.query) {
    where_clauses.push('id >= ?')
    where_vals.push(req.query.id_GE)
  }

  if ('id_LE' in req.query) {
    where_clauses.push('id <= ?')
    where_vals.push(req.query.id_LE)
  }

  if ('name_GE' in req.query) {
    where_clauses.push('name >= ?')
    where_vals.push(req.query.name_GE)
  }

  if ('name_LE' in req.query) {
    where_clauses.push('id <= ?')
    where_vals.push(req.query.name_LE)
  }

  where_clause = where_clauses.join(' AND ')
  if (where_clause !== '') {
    where_clause = ' WHERE ' + where_clause
  }

  function colspec_to_orderby(spec) {
    // not worried about match failing because we've already validated this
    match = spec.match(/^(\w+)([+-]?)$/)
    column_name = match[1]
    clause = column_name
    if (match[2] === '-') {
      clause += ' DESC'
    }
    return clause
  }

  // console.log({ foo: validate.UserSortOption("foo", "{foo}"),
  //     id: validate.UserSortOption("id", "{id}"),
  //     empty: validate.UserSortOption("", "{foo}") })

  // console.log({
  //   foo: validate.UserSortingSpec(['foo'], '{foo}'),
  //   id: validate.UserSortingSpec(['id'], '{id}'),
  //   empty: validate.UserSortingSpec([], '{}'),
  // })

  sort_clause = 'id'
  if ('sort' in req.query && req.query.sort.length > 0) {
    options = req.query.sort.split(',')
    errors = validate.UserSortingSpec(options, '{sort param}')
    if (errors.length) {
      res.json(errors)
      res.statusMessage = 'Invalid data'
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
      return
    }

    //console.log({ str: req.query.sort, options, sort_clause })
    sort_clause = options.map((x) => colspec_to_orderby(x)).join(',')

    //console.log({ sort_clause, from: req.query.sort })
  }

  //console.log({base,where_clause,where_clauses,where_vals,queryparams:req.query,sort_clause})

  const stmt = db.prepare(base + where_clause + ' ORDER BY ' + sort_clause)

  users = stmt.all(where_vals)
  users.forEach((user) => {
    user.uri = uri(`/user/${user.id}`)
  })
  res.json({ users: users })
})

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
 */
router.post('/users', (req, res) => {
  const user = req.body

  errors = validate.CreatingUser(user, '{body}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'Invalid data'
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
    return
  }

  const stmt = db.prepare(`INSERT INTO users (name, password)
                 VALUES (?, ?)`)

  try {
    info = stmt.run([user.name, user.password])
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.statusMessage = 'Account already exists'
      res.status(StatusCodes.BAD_REQUEST).end()
      return
    }
    console.log('insert error: ', { err, info, user })
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
    return
  }

  // we're just returning what they submitted. but we never return the password
  user.id = info.lastInsertRowid
  user.uri = uri(`/user/${user.id}`)
  delete user.password

  res.set('Location', user.uri)
  res.type('json')
  res.json(user)
  res.status(StatusCodes.CREATED)
})

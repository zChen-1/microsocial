/**
 * @swagger
 * tags: 
 *    - name: Examples
 *      description: Example code. Do not use this as a real service
 *    - name: Users API 
 *    - name: Content API
 *    - name: Auth API
 *    - name: Schema
 */

/**
 * @swagger
 * components:
 *   schemas:
<<<<<<< HEAD
 *     RelationshipId:
 *       type: integer
 *       minimum: 1
 *       readOnly: true
 * 
 *     Relationship:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - following_user_id
=======
 *     UserId:
 *       type: integer
 *       minimum: 1
 *       readOnly: true
 *            
 * 
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - password
>>>>>>> 1c862d2dbbe681e000137fb68a71dbce664208f4
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
<<<<<<< HEAD
 *           description: Auto generated id of a relationship, is unique
 *         user_id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: user_id from user that follows another user
 *         following_user_id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: user_id from user that user_id is following
=======
 *           description: The auto-generated id of the User. Will be unique.
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: No leading or trailing spaces. Never returned by an API.
 *         uri:
 *           type: string
 *           readOnly: true
 *           format: password
 *           description: URI to this object. Set by API at User creation.
 *       examples: [
 *         { id: 1, name: "alonzo", password: "lambda", uri: "http://lh:8/user/14" }
 *       ]
 * 
 *     LoginInfo:
 *       type: object
 *       required:
 *         - name
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with.
 *         password:
 *           type: string
 *           minLength: 4
 *           format: '^[^ ]{4,}$'
 *           description: No leading or trailing spaces.
 *       examples: [
 *         { name: "alonzo", password: "lambda" }
 *       ]
 * 
 *     LoginToken:
 *       type: object
 *       summary: JWT for authentication
 *       properties:
 *         client_id:
 *           type: integer
 *           readOnly: true
 *           description: id of user
 *         access_token:
 *           type: string
 *           readOnly: true
 *           description: Opaque string. To be passed as in Authentication header as "Bearer <token>.
 *         refresh_token:
 *           type: string
 *           readOnly: true
 *           minLength: 36
 *           maxLength: 36
 *           description: Opaque string. To be passed when access_token expires.
 *       
 *     RefreshToken:
 *       type: object
 *       summary: A Refresh Token
 *       required:
 *         - refresh_token
 *       properties:
 *         refresh_token:
 *           type: string
 *           readOnly: true
 *           minLength: 36
 *           maxLength: 36
 *           description: Opaque string. To be passed when access_token expires.
 *       
 *     RetrievedUser:
 *       type: object
 *       summary: User schema submitted when updating.
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
 *           description: Name that they log in with. Must be unique
>>>>>>> 1c862d2dbbe681e000137fb68a71dbce664208f4
 *         uri:
 *           type: string
 *           readOnly: true
 *           format: password
<<<<<<< HEAD
 *           description: URI to this object. Set by API at User creation.
 * 
 *       CreatingRelationship:
 *         type: object
 *         required:
 *           - user_id
 *           - following_user_id
 *         properties:
 *           user_id:
 *             type: integer
 *             minimum: 1
 *           description: corresponding user id
 *           following_user_id:
 *             type: integer
 *             minimum: 1
 *             description: user id from user thats being followed
 *     
 * 
 */
=======
 *           description: URI to this object. Set by endpoint at creation.
 *       examples: [
 *         { id: 1, name: "alonzo", uri: "http://lh:8/user/14" }
 *       ]
 * 
 * 
 *     CreatingUser:
 *       type: object
 *       required:
 *         - name
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: Guess. No leading or trailing spaces. Never returned by an API.
 *       examples: [
 *         { name: "alonzo", password: "lambda" }
 *       ]
 * 
 * 
 *     UpdatingUser:
 *       type: object
 *       summary: User schema submitted when updating.
 *       required:
 *         - name
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: Guess. No leading or trailing spaces. Never returned by an API.
 *       examples: [
 *         { name: "alonzo", password: "lambda" }
 *         ]
 * 
 * 
 *     PatchingUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: Guess. No leading or trailing spaces. Never returned by an API.
 *       examples: [
 *         { name: "alonzo", password: "lambda" }
 *       ]
 */

>>>>>>> 1c862d2dbbe681e000137fb68a71dbce664208f4

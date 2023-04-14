import express from 'express'
import { addComment, getAllComments, updateComment } from '../controllers/comment.js'

const router = express.Router()
/**
 * @swagger
 * /content/comments:
 *   get:
 *     summary: Get all comments!
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getAllComments)


/**
 * @swagger
 * /content/comments:
 *   post:
 *     summary: Add a new comment!
 *     tags: [Content API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: integer
 *               username:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', addComment)


/**
 * @swagger
 * /content/comments:
 *   put:
 *     summary: Update a comment!
 *     tags: [Content API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: integer
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input data
 */
router.put('/', updateComment)

export default router
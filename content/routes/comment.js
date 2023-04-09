import express from 'express'
import { testComment, testCommentv2 } from '../controllers/comment.js'

const router = express.Router()
/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Comment Route!
 *     description: Base page. Just says hello.
 *     operationId: comment
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/', testComment)


/**
 * @swagger
 * /comment/v2:
 *   get:
 *     summary: Comment Route v2!
 *     description: Base page. Just says hello.
 *     operationId: comment
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/v2', testCommentv2)

export default router
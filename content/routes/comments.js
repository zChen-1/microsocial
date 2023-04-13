import express from 'express'
import { testComment } from '../controllers/comment.js'

const router = express.Router()
/**
 * @swagger
 * /content/comments:
 *   get:
 *     summary: Comment Route!
 *     description: Base page. Just says hello.
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


export default router
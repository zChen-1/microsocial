import express from 'express'
import { testPost, testPostv2 } from '../controllers/post.js'

const router = express.Router()

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Post Route!
 *     description: Base page. Just says post route.
 *     operationId: post
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Post route text
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/', testPost)

/**
 * @swagger
 * /post/v2:
 *   get:
 *     summary: Post Route!
 *     description: Base page. Just says post route.
 *     operationId: post
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Post route text
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/v2', testPostv2)

export default router
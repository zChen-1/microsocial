import express from 'express'
import { db } from '../db.js'

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
router.get('/', (req, res) => {
    res.send('post route')
})

router.get('/v2', (req, res) => {
    res.send('post route v2')
})

export default router
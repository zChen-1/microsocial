import express from 'express'
import { db } from '../db.js'

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
 *         description: Boring Text
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/', (req, res) => {
    res.send('comment route')
})

router.get('/v2', (req, res) => {
    res.send('comment route v2')
})

export default router
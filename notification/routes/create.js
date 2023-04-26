import express from 'express'
import {db} from '../db.js'

const router = express.Router()

/**
 * @swagger
 * /notification/create:
 *   post:
 *     summary: Add a new notification!
 *     tags: [Notification API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender_username:
 *                 type: string
 *               receiver_username:
 *                 type: string
 *               action:
 *                 type: string
 *               read:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Invalid input data
 */

router.post('/', (req, res) => {
    // Insert to database
    const { sender_username, receiver_username, action, read } = req.body
    const current_date = new Date()
    const q = db.prepare('INSERT INTO notification (sender_username, receiver_username, action, date, read) VALUES (?, ?, ?, ?, ?)')
    q.run(sender_username, receiver_username, action, current_date.toISOString(), read)
    return res.status(201).json({ message: "success" })
})



export default router
import { db } from "../db.js";

export const getAllComments = async (req, res) => {
    const q = db.prepare('SELECT * FROM comments')
    const result = q.all()
    return res.status(200).json({
        result: result
    })
}


export const addComment = async(req, res) => {
    const { post_id, username, body } = req.body
    const currentDate = new Date()
    if(!post_id || !username || !body)
        return res.status(400).json({ error: "Missing required data" })
    
    const q = db.prepare(`INSERT INTO comments (post_id, username, body, date) VALUES(?, ?, ?, ?);`)
    q.run(post_id, username, body, currentDate.toISOString())

    res.status(200).json({ message: "success" })
}


export const updateComment = async(req, res) => {
    const { comment_id, body } = req.body
    if(!comment_id || !body)
        return res.status(400).json({ error: "Missing required data" })

    const q = db.prepare(`UPDATE comments SET body=? WHERE id=?`)
    const result = q.run(body, comment_id).changes

    if(result > 0)
        res.status(204).json({ message: "Success" })
    else
        res.status(400).json({ error: "Id not found" })
}
import { db } from "../db.js";


export const getAllPosts = async (req, res) => {
    const q = db.prepare('SELECT * FROM posts')
    const result = q.all()
    return res.status(200).json({
        result: result
    })
}


export const getPostById = async (req, res) => {
    const { post_id } = req.params
    if(!post_id)
        return res.status(400).json({error: "Invalid id"})

    const q = db.prepare('SELECT * FROM posts WHERE id=?')
    const result = q.get(post_id)

    if(result)
        return res.status(200).json({result: result})
    else
        return res.status(404).json({error: "Item not found"})
}

export const getPostByUsername = async (req, res) => {
    const { username } = req.params

    if(!username)
        return res.status(400).json({error: "Invalid Id"})

    const q = db.prepare('SELECT * FROM posts WHERE username=?')
    const result = q.all(username)
    if(result)
        return res.status(200).json({ result: result })
    else
        return res.status(404).json({error: "Item not found"})
}   

export const createPost = async(req, res) => {
    const { username, title, description } = req.body
    const tags = req.body.tags || null
    const image = req.body.image || null
    const currentDate = new Date();

    if(!username || !title || !description) 
        return res.status(400).json({ error: "Invalid Data Input" })

    // Insert to database
    const q = db.prepare('INSERT INTO posts (username, title, date, tags, image, description) VALUES (?, ?, ?, ?, ?, ?)')
    q.run(username, title, currentDate.toISOString(), tags, image, description)

    return res.status(200).json({ success: "success" })
}
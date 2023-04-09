import { db } from "../db.js";

export const testComment = async (req, res) => {
    res.send('Comment route')
}

export const testCommentv2 = async (req, res) => {
    res.send('Comment route v2')
}
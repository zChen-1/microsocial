import { db } from "../db.js";


export const testPost = async (req, res) => {
    res.send('Test Post Route')
}

export const testPostv2 = async (req, res) => {
    res.send('Test Post Route v2')
}
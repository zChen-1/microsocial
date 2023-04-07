import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from "dotenv"


dotenv.config()

const app = express()
const PORT = process.env.PORT || 8001

app.use(bodyParser.json({ limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}))
app.use(cors())


app.get('/', (req, res) => {
    res.send("Hello")
})

app.use('/api', (req, res) => {
    res.send("Content Route")
})


app.listen(PORT, () => {
    console.log(`server started on ${PORT}`)
})
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from "dotenv"
import helmet from 'helmet'
import posts from './routes/post.js'
import comments from './routes/comment.js'
import { testCreateTable, testTable, testDropTable } from './db.js'
import { swaggerSpec, swaggerUIOptions } from './swagger-config/swagger.js'
import swaggerUi from 'swagger-ui-express';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8001

app.set("title", "Microsocial Content API");
app.use(bodyParser.json({ limit: "50mb", extended: true}))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true}))
app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use('/docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, swaggerUIOptions)
)

// Default route
app.get('/', (req, res) => {
    res.send("Hello")
})

// Service routes
app.use('/post', posts)
app.use('/comment', comments)

// Test db to see if INSERT, CREATE, AND GET work
testCreateTable()
testTable()
testDropTable()


app.listen(PORT, () => {
    console.log(`server started on ${PORT}`)
})
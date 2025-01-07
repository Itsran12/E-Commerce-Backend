import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import { publicApi } from "../route/publicRoute"
import { privateApi } from "../route/privateRoute"
import { errorMiddleware } from "../middleware/errorMiddleware"

dotenv.config()
export const app = express()

app.use(cors({
    origin: process.env.CLIENT_PORT,
    credentials: true
}))

app.use(express.json())
app.use(publicApi)
app.use(privateApi)

app.use(errorMiddleware)
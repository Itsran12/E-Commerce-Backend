import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import { ErrorMiddleware } from "../middleware/errorMiddleware"
import { publicRoute } from "../routes/publicRoute"

dotenv.config()

export const app = express()

app.use(cors({
    origin: process.env.CLIENT_PORT,
    credentials: true
}))

app.use(express.json())
app.use(publicRoute)

app.use(ErrorMiddleware)

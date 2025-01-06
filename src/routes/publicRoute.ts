import express from "express"
import { UserController } from "../controllers/userController"

export const publicRoute = express.Router()

publicRoute.post("/api/register", UserController.register)
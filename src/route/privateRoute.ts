import express, { RequestHandler } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { UserController } from "../controller/userController"

export const privateApi = express.Router()
privateApi.use(authMiddleware as RequestHandler)

privateApi.get("/api/users", UserController.get)
privateApi.patch("/api/users", UserController.update)
privateApi.delete("/api/logout", UserController.logout)
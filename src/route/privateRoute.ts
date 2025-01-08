import express, { RequestHandler } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { UserController } from "../controller/userController"
import { CategoryController } from "../controller/categoryController"

export const privateApi = express.Router()
privateApi.use(authMiddleware as RequestHandler)

privateApi.get("/api/users", UserController.get)
privateApi.patch("/api/users", UserController.update)
privateApi.delete("/api/logout", UserController.logout)

privateApi.post("/api/categories", CategoryController.create)
privateApi.get("/api/categories", CategoryController.getAll)
privateApi.get("/api/categories/:id", CategoryController.get)
privateApi.patch("/api/categories/:id", CategoryController.update)
privateApi.delete("/api/categories/:id", CategoryController.delete)
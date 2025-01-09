import express, { RequestHandler } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { UserController } from "../controller/userController"
import { CategoryController } from "../controller/categoryController"
import { ProductController } from "../controller/productController"
import { ColorController } from "../controller/colorController"

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

privateApi.post("/api/products", ProductController.create)
privateApi.get("/api/products", ProductController.getAll)
privateApi.get("/api/products/:id", ProductController.get)
privateApi.patch("/api/products/:id", ProductController.update)
privateApi.delete("/api/products/:id", ProductController.delete)

privateApi.post("/api/colors", ColorController.create)
privateApi.get("/api/colors", ColorController.getAll)
privateApi.get("/api/colors/:id", ColorController.get)
privateApi.patch("/api/colors/:id", ColorController.update)
privateApi.delete("/api/colors/:id", ColorController.delete)
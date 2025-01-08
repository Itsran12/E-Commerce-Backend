import { CreateCategoryRequest, UpdateCategoryRequest } from "../model/categoryModel"
import { CategoryService } from "../service/categoryService"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class CategoryController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateCategoryRequest = req.body as CreateCategoryRequest
            const response = await CategoryService.create(req.user!, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const categoryId = req.params.id
            const request = await CategoryService.get(req.user!, categoryId)
            res.status(200).json({
                data: request
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request = await CategoryService.getAll(req.user!)
            res.status(200).json({
                data: request
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateCategoryRequest = req.body as UpdateCategoryRequest
            request.id = req.params.id
            const response = await CategoryService.update(req.user!, request) 
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const categoryId = req.params.id
            await CategoryService.delete(req.user!, categoryId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}
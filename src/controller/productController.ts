import { CreateProductRequest, UpdateProductRequest } from "../model/productModel"
import { ProductService } from "../service/productService"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class ProductController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateProductRequest = req.body as CreateProductRequest
            const response = await ProductService.create(req.user!, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id
            const categoryId = req.query.categoryId as string
            const response = await ProductService.get(categoryId, productId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const categoryId = req.query.categoryId as string
            const response = await ProductService.getAll(categoryId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateProductRequest = req.body as UpdateProductRequest
            request.id = req.params.id
            const response = await ProductService.update(req.user!, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id
            await ProductService.delete(req.user!, productId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}
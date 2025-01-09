import { CreateProductRequest, UpdateProductRequest, ProductResponse, toProductResponse } from "../model/productModel"
import { Validation } from "../util/validation/validation"
import { ProductValidation } from "../util/validation/productValidation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User, Product } from "@prisma/client"

export class ProductService {
    static async create(user: User, request: CreateProductRequest): Promise<ProductResponse> {
        const createRequest = Validation.validate(ProductValidation.CREATE, request)
        if(user.role !== "ADMIN") {
            throw new ResponseError(403, "Unauthorized: Only admins can create products")
        }

        const category = await prismaClient.category.findUnique({
            where: {
                id: createRequest.categoryId
            }
        })

        if(!category) {
            throw new ResponseError(404, "Category not found")
        }

        const record = {
            ...createRequest,
            ...{categoryId: category.id}
        }

        const result = await prismaClient.product.create({
            data : record
        })

        return toProductResponse(result)
    }

    static async checkProductMustBeExist(categoryId: string, productId: string): Promise<Product> {
        const result = await prismaClient.product.findFirst({
            where: {
                id: productId,
                categoryId: categoryId
            }
        })

        if(!result) {
            throw new ResponseError(404, "Product not found")
        }

        return result
    }

    static async get(categoryId: string, id: string): Promise<ProductResponse> {
        const result = await this.checkProductMustBeExist(categoryId, id)
        return toProductResponse(result)
    }

    static async getAll(categoryId: string): Promise<ProductResponse[]> {
        const result = await prismaClient.product.findMany({
            where: {
                categoryId: categoryId
            }
        })

        return result.map(toProductResponse)
    }

    static async update(user: User, request: UpdateProductRequest): Promise<ProductResponse> {
        const updateRequest = Validation.validate(ProductValidation.UPDATE, request)
        if(user.role !== "ADMIN") {
            throw new ResponseError(403, "Unauthorized: Only admins can update products")
        }

        if(updateRequest.categoryId){
            const category = await prismaClient.category.findUnique({
                where: {
                    id: updateRequest.categoryId
                }
            })

            if(!category) {
                throw new ResponseError(404, "Category not found")
            }
        }

        const result = await prismaClient.product.update({
            where: {
                id: updateRequest.id
            },
            data: {
                ...updateRequest
            }
        })

        return toProductResponse(result)
    }  

    static async delete(user: User, id: string): Promise<ProductResponse> {
    if (user.role !== "ADMIN") {
        throw new ResponseError(403, "Unauthorized: Only admins can delete products")
    }

    const product = await prismaClient.product.findUnique({
        where: { id },
        include: { category: true },
    })

    if (!product) {
        throw new ResponseError(404, "Product not found")
    }

    if (product.category.userId !== user.id) {
        throw new ResponseError(403, "Unauthorized: You do not have access to this category")
    }

    const result = await prismaClient.product.delete({
        where: { id },
    })

    return toProductResponse(result)
    }
}


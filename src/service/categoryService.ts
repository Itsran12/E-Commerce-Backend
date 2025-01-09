import { CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse, toCategoryResponse } from "../model/categoryModel"
import { Validation } from "../util/validation/validation"
import { CategoryValidation } from "../util/validation/categoryValidation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { Category, User } from "@prisma/client"

export class CategoryService {
    static async create(user: User, request: CreateCategoryRequest): Promise<CategoryResponse> {
        const createRequest = Validation.validate(CategoryValidation.CREATE, request)
        if(user.role !== "ADMIN") {
            throw new ResponseError(403, "Unauthorized: Only admins can create categories")
        }

        const existingCategory = await prismaClient.category.findUnique({
            where: {
                name: createRequest.name
            }
        })

        if(existingCategory) {
            throw new ResponseError(400, "Category already exists")
        }

        const record = {
            ...createRequest,
            ...{userId: user.id}
        }
        
        const response = await prismaClient.category.create({
            data: record
        })

        return toCategoryResponse(response)
    }

    static async checkCategoryMustBeExist(userId: string, categoryId: string): Promise<Category> {
        const request = await prismaClient.category.findFirst({
            where: {
                id: categoryId,
                userId: userId
            }
        })

        if(!request) {
            throw new ResponseError(404, "Category not found")
        }

        return request
    }

    static async get(user: User, id: string): Promise<CategoryResponse> {
        const request = await this.checkCategoryMustBeExist(user.id, id)
        return toCategoryResponse(request)
    }

    static async getAll(user: User): Promise<CategoryResponse[]> {
        const request = await prismaClient.category.findMany({
            where: {
                userId: user.id
            }
        })

        return request.map(toCategoryResponse)
    }

    static async update(user: User, request: UpdateCategoryRequest): Promise<CategoryResponse> {
        const updateRequest = Validation.validate(CategoryValidation.UPDATE, request)
        if(user.role !== "ADMIN") {
            throw new ResponseError(403, "Unauthorized: Only admins can create categories")
        }

        const response = await prismaClient.category.update({
            where: {
                id: updateRequest.id
            },
            data: {
                ...updateRequest,
                userId: user.id
            }
        })

        return toCategoryResponse(response)
    }

    static async delete(user: User, id: string): Promise<CategoryResponse> {
        if (user.role !== "ADMIN") {
            throw new ResponseError(403, "Unauthorized: Only admins can delete categories")
        }

        await this.checkCategoryMustBeExist(user.id, id)
        const response = await prismaClient.category.delete({
            where: {
                id: id,
                userId: user.id
            }
        })
        
        return toCategoryResponse(response)
    }
}
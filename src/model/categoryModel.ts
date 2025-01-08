import { Category } from "@prisma/client"

export type CategoryResponse = {
    name: string
    userId: string
}

export type CreateCategoryRequest = {
    name: string
    userId: string
}

export type UpdateCategoryRequest = {
    id: string
    name?: string
}

export function toCategoryResponse(category: Category): CategoryResponse {
    return {
        name: category.name,
        userId: category.userId
    }
}
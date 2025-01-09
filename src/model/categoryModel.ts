import { Category } from "@prisma/client"

export type CategoryResponse = {
    id: string
    name: string
}

export type CreateCategoryRequest = {
    name: string
    id: string
}

export type UpdateCategoryRequest = {
    id: string
    name?: string
}

export function toCategoryResponse(category: Category): CategoryResponse {
    return {
        name: category.name,
        id: category.id
    }
}
import { Product } from "@prisma/client"

export type ProductResponse = {
    id: string
    name: string
    description: string
    price: number
    stock: number
}

export type CreateProductRequest = {
    categoryId: string
    name: string
    description: string
    price: number
    stock: number
}

export type UpdateProductRequest = {
    id: string
    categoryId: string
    name?: string
    description?: string
    price?: number
    stock?: number
}

export function toProductResponse(product: Product): ProductResponse {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
    }
}
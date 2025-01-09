import { prismaClient } from "../src/app/database"
import { Category, Product, User, ProductImage } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                email: "example@gmail.com"
            }
        })
    }

    static async create() {
        const user = await prismaClient.user.create({
            data: {
                name: "example",
                phone: "+628123456789",
                email: "example@gmail.com",
                password: await bcrypt.hash("Example@2003", 10),
                role: "ADMIN"
                
            }
        })

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET_KEY! , { expiresIn: "1d" })
        
        const updateUser = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                token: token
            }
        })

        return updateUser
    }

    static async get(): Promise<User> {
        const user = await prismaClient.user.findFirst({
            where: {
                email: "example@gmail.com"
            }
        })

        if(!user) {
            throw new Error("User not found")
        }

        return user
    }
}

export class CategoryTest {
    static async delete() {
        await prismaClient.category.deleteMany({
            where: {
                user: {
                    email: "example@gmail.com"
                }
            }
        })
    }

    static async create(userId: string, data: Partial<{ name: string }> = {}): Promise<Category> {
        const categories = await prismaClient.category.create({
            data: {
                name: data.name || "test",
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })

        return categories
    }

    static async get(userId: string): Promise<Category> {
        const categories = await prismaClient.category.findFirst({
            where: {
                userId: userId
            }
        })

        if(!categories) {
            throw new Error("Category not found")
        }

        return categories
    }
}

export class ProductTest {
    static async delete() {
        await prismaClient.product.deleteMany({
            where: { category: { user: { email: "example@gmail.com" }}}
        })
    }

    static async create(categoryId: string, data: Partial<{ name: string, description: string, price: number, stock: number}> = {}): Promise<Product> {
        const products = await prismaClient.product.create({
            data: {
                name: data.name || "test",
                description: data.description || "test",
                price: data.price || 10000,
                stock: data.stock || 10,
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        })
        
        return products
    }

    static async get(categoryId: string): Promise<Product> {
        const products = await prismaClient.product.findFirst({
            where: {
                categoryId: categoryId
            }
        })

        if(!products) {
            throw new Error("Category not found")
        }

        return products
    }
}

export class ColorTest {
    static async delete() {
        await prismaClient.color.deleteMany({
            where: {
                name: "test"
            }
        })
    }

    static async create(data: Partial<{ name: string, hexCode: string }> = {}) {
        const colors = await prismaClient.color.create({
            data: {
                name: data.name || "test",
                hexCode: data.hexCode || "test"
            }
        })

        return colors
    }

    static async get() {
        const colors = await prismaClient.color.findFirst({
            where: {
                name: "test"
            }
        })

        if(!colors) {
            throw new Error("color not found")
        }

        return colors
    }
}


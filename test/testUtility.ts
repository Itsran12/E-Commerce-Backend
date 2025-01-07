import { prismaClient } from "../src/app/database"
import { User } from "@prisma/client"
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
                password: await bcrypt.hash("Example@2003", 10)
            }
        })

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
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
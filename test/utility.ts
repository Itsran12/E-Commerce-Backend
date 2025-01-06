import { prismaClient } from "../src/app/database"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where : {
                email: "test@gmail.com"
            }
        })
    }

    static async create() {
        await prismaClient.user.create({
            data: {
                name    : "test",
                phone   : "08123456789",
                email   : "test@gmail.com",
                password: await bcrypt.hash("test", 10)
            }
        })
    }

    static async get(): Promise<User> {
        const user = await prismaClient.user.findUnique({
            where: {
                email: "test@gmail.com"
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        return user
    }
}
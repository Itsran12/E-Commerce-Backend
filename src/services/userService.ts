import { CreateUserRequest, UpdateUserRequest, LoginUserRequest, UserResponse, toUserResponse } from "../models/userModel"
import { Validation } from "../util/validation/validation"
import { UserValidation } from "../util/validation/userValidation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/errorResponse"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request)
        const emailExist = await prismaClient.user.findUnique({
            where: {
                email: registerRequest.email
            }
        })

        if (emailExist) {
            throw new ResponseError(400, "Email already exist")
        }

        const hashPassword = await bcrypt.hash(registerRequest.password, 10)
        const createUser = await prismaClient.user.create({
            data: {
                name: registerRequest.name,
                email: registerRequest.email,
                password: hashPassword,
            }
        })

        return toUserResponse(createUser)
    }
}
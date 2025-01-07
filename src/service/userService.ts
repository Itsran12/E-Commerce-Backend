import { createUserRequest, UpdateUserRequest, LoginUserRequest, UserResponse, toUserResponse } from "../model/userModel"
import { Validation } from "../util/validation/validation"
import { UserValidation } from "../util/validation/userValidation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User, Role } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class UserService {
    static async register(request: createUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, {
            ...request,
            role: request.role || "USER"
        })

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10)
        const emailWithSame = await prismaClient.user.count({
            where: {
                email: registerRequest.email
            }
        })

        if(emailWithSame !== 0) {
            throw new ResponseError(400, "Email already exist")
        }

        const response = await prismaClient.user.create({
            data: {
                ...registerRequest,
                role: registerRequest.role as Role
            }
        })

        return toUserResponse(response)
    }

    static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user)
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request)
        user = {
            ...user,
            ...(updateRequest.name && {name: updateRequest.name}),
            ...(updateRequest.phone && {phone: updateRequest.phone}),
            ...(updateRequest.password && {password: await bcrypt.hash(updateRequest.password, 10)})
        }

        const response = await prismaClient.user.update({
            where: {
                email: user.email
            },
            data: user
        })

        return toUserResponse(response)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request)
        let user = await prismaClient.user.findUnique({
            where: {
                email: loginRequest.email
            }
        })

        if(!user) {
            throw new ResponseError(404, "Email or Password wrong")
        }

        const isPasswordMatch = await bcrypt.compare(loginRequest.password, user.password)

        if(!isPasswordMatch) {
            throw new ResponseError(404, "Email or Password wrong")
        }

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d"
        })

        user = await prismaClient.user.update({
            where: {
                email: loginRequest.email
            },
            data: {
                token: token
            }
        })

        const response = toUserResponse(user)
        response.token = token
        return response
    }

    static async logout(user: User): Promise<UserResponse> {
        const response = await prismaClient.user.update({
            where: {
                email: user.email
            },
            data: {
                token: null
            }
        })

        return toUserResponse(response)
    }
}
import { User, Role } from "@prisma/client"

export type UserResponse = {
    name: string
    email: string
    phone?: string | null
    role: Role
    token?: string
}

export type createUserRequest = {
    name: string
    email: string
    password: string
    phone?: string
    role: Role
}

export type UpdateUserRequest = {
    name?: string
    password?: string
    phone?: string
}

export type LoginUserRequest = {
    email: string
    password: string
}

export function toUserResponse(user: User): UserResponse {
    return {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    }
}
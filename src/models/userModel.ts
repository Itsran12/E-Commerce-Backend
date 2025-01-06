import { User, Role } from "@prisma/client"

export type UserResponse = {
    name        : string
    email       : string
    phone?      : string | null
    token?      : string
    role?       : Role
}

export type CreateUserRequest = {
    name        : string
    phone?      : string
    email       : string
    password    : string
    role?       : Role
}

export type LoginUserRequest = {
    email       : string
    password    : string
}

export type UpdateUserRequest = {
    phone?      : string
    name?       : string
    password?   : string
}

export function toUserResponse(user: User): UserResponse {
    return {
        name    : user.name,
        phone   : user.phone,
        email   : user.email,
        role    : user.role
    }
}
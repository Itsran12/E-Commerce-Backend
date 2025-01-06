import { CreateUserRequest } from "../models/userModel"
import { UserService } from "../services/userService"
import { UserRequest } from "../util/type/type"
import { Request, Response, NextFunction } from "express"

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as CreateUserRequest
            const response = await UserService.register(request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }
}
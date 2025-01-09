import { CreateColorRequest, UpdateColortRequest } from "../model/colorModel"
import { ColorService } from "../service/colorService"
import { UserRequest } from "../util/type/type"
import { Response, NextFunction } from "express"

export class ColorController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateColorRequest = req.body as CreateColorRequest
            const response = await ColorService.createColor(req.user!, request)
            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const colorId = req.params.id
            const response = await ColorService.get(colorId)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await ColorService.getAll()
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateColortRequest = req.body as UpdateColortRequest
            request.id = req.params.id
            const response = await ColorService.update(req.user!, request)
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const colorId = req.params.id
            await ColorService.delete(req.user!, colorId)
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}
import { CreateColorRequest, UpdateColortRequest, ColorResponse, toColorResponse } from "../model/colorModel"
import { Validation } from "../util/validation/validation"
import { ColorValidation } from "../util/validation/colorValidation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { Color, User } from "@prisma/client"

export class ColorService {
    static async createColor(user: User, request: CreateColorRequest): Promise<ColorResponse> {
        const createRequest = Validation.validate(ColorValidation.CREATE, request)
        if (user.role !== "ADMIN") {
            throw new ResponseError(403, "Unauthorized: Only admins can create colors.")
        }

        const existingColor = await prismaClient.color.findUnique({
            where: { name: createRequest.name }
        })

        if (existingColor) {
            throw new ResponseError(400, "Color already exists.")
        }

        const response = await prismaClient.color.create({ data: createRequest })
        return toColorResponse(response)
    }

    static async checkColorExists(id: string): Promise<Color> {
        if (!id) {
            throw new ResponseError(400, "Invalid color ID");
        }
    
        const color = await prismaClient.color.findUnique({
            where: { id }
        });
    
        if (!color) {
            throw new ResponseError(404, "Color not found");
        }
    
        return color;
    }    

    static async get(id: string): Promise<ColorResponse> {
        const result = await this.checkColorExists(id)
        return toColorResponse(result)
    }

    static async getAll(): Promise<ColorResponse[]> {
        const result = await prismaClient.color.findMany()
        return result.map(toColorResponse)
    }

    static async update(user: User, request: UpdateColortRequest): Promise<ColorResponse> {
        const updateRequest = Validation.validate(ColorValidation.UPDATE, request)
        if (user.role !== "ADMIN") {
            throw new ResponseError(403, "Unauthorized: Only admins can update colors.")
        }

        await this.checkColorExists(updateRequest.id)

        const { id, ...data } = updateRequest
        const result = await prismaClient.color.update({
            where: { id },
            data
        })

        return toColorResponse(result)
    }

    static async delete(user: User, id: string): Promise<ColorResponse> {
        if (user.role !== "ADMIN") {
            throw new ResponseError(403, "Unauthorized: Only admins can delete colors.")
        }

        const result = await prismaClient.color.delete({ where: { id } })
        return toColorResponse(result)
    }
}

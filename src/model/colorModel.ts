import { Color } from "@prisma/client"

export type ColorResponse = {
    id: string
    name: string
    hexCode: string
}

export type CreateColorRequest = {
    name: string
    hexCode: string
}

export type UpdateColortRequest = {
    id: string
    name?: string
    hexCode?: string
}

export function toColorResponse(color: Color): ColorResponse {
    return {
        id: color.id,
        name: color.name,
        hexCode: color.hexCode
    }
}
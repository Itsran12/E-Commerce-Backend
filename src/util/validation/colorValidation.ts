import { ZodType, z } from "zod"

export class ColorValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
        hexCode: z.string().min(1).max(100)
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces").optional(),
        hexCode: z.string().min(1).max(100).optional()
    })
}
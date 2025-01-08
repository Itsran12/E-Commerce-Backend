import { ZodType, z } from "zod"

export class CategoryValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces")
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.string().min(1, "Address ID is required"),
        name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces")
    })
}
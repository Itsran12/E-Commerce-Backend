import { ZodType, z } from "zod"

export class ProductValidation {
    static readonly CREATE: ZodType = z.object({
        categoryId: z.string().min(1, "Category ID is required"),
        name: z.string().max(100).regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
        description: z.string().max(1000),
        price: z.number().min(0).multipleOf(0.01),
        stock: z.number().min(0).int()
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.string().min(1, "Product ID is required"),
        name: z.string().max(100).regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces").optional(),
        description: z.string().max(1000).optional(),
        price: z.number().min(0).multipleOf(0.01).optional(),
        stock: z.number().min(0).int().optional()
    })
}
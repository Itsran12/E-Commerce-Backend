import { ZodType, z } from "zod"
import { Role } from "@prisma/client"

const phoneNumberSchema = z.string().refine((value) => {
    const phoneRegex = /^(^\+62|62|^0)(\d{9,13})$/
    return phoneRegex.test(value)
},  { message: "Nomor telepon tidak valid!, gunakan +62 atau 08"})
    .transform((value) => {
        const cleanedNumber = value.replace(/\D/g, '')
        if (cleanedNumber.startsWith("0")) {
            return `+62${cleanedNumber.slice(1)}`
        } else if (cleanedNumber.startsWith("08")) {
            return cleanedNumber
        } else if (cleanedNumber.startsWith("+62")) {
            return value
        } else {
            return `+62${cleanedNumber}`
        }
    })

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        name    : z.string().min(5).max(100),
        phone   : phoneNumberSchema,
        email   : z.string().email().max(25),
        password: z.string().min(8).max(25).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/,
            "Password harus mengandung huruf kecil, huruf besar, angka, dan simbol."),
        role    : z.nativeEnum(Role)
    })

    static readonly UPDATE: ZodType = z.object({
        phone   : phoneNumberSchema,
        name    : z.string().min(5).max(100),
        password: z.string().min(8).max(25).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/,
            "Password harus mengandung huruf kecil, huruf besar, angka, dan simbol.")
    })

    static readonly LOGIN: ZodType = z.object({
        email   : z.string().email().max(25),
        password: z.string().min(8).max(25).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/,
            "Password harus mengandung huruf kecil, huruf besar, angka, dan simbol.")
    })
}
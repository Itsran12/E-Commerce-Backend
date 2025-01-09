import { ZodType, z } from "zod"
import { Role } from "@prisma/client"

const phoneNumberSchema = z.string().refine((value) => {
        const phoneRegex = /^(^\+62|62|^0)(\d{9,13})$/;
        return phoneRegex.test(value);
    }, {
        message: "Invalid phone number, use format +62",
    }).transform((value) => {
        const cleanedNumber = value.replace(/\D/g, '');
        if (cleanedNumber.startsWith("0")) {
            return "+62" + cleanedNumber.slice(1);
        } else if (cleanedNumber.startsWith("62")) {
            return `+${cleanedNumber}`;
        } else if (cleanedNumber.startsWith("+62")) {
            return value;
        }
        return `+62${cleanedNumber}`;
})

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        name: z.string().max(100),
        phone: phoneNumberSchema,
        email: z.string().email(),
        password: z.string().min(8).max(20).refine((value) => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/.test(value),
            { message: "Must contain at least one lowercase letter, one uppercase letter, one number, and one symbol" }
        }),
        role: z.nativeEnum(Role),
    })

    static readonly LOGIN: ZodType = z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20).refine((value) => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/.test(value),
            { message: "Must contain at least one lowercase letter, one uppercase letter, one number, and one symbol" }
        })
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().max(100).optional(),
        phone: phoneNumberSchema.optional(),
        password: z.string().min(8).max(20).refine((value) => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/.test(value),
            { message: "Must contain at least one lowercase letter, one uppercase letter, one number, and one symbol" }
        }).optional()
    })
}

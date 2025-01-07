import { Request, Response, NextFunction } from "express"
import { ResponseError } from "../util/error/error"
import { ZodError } from "zod"

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof ZodError) {
        res.status(400).json({
            errors: `Valdiation Error : ${error}`
        })
    }else if(error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message
        })
    }else {
        res.status(500).json({
            errors: "Internal Server Error"
        })
    }
}
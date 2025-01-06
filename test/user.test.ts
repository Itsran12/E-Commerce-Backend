import supertest from "supertest"
import { app } from "../src/app/service"
import { UserTest } from "./utility"
import { logger } from "../src/app/logging"
import bcrypt from "bcrypt"

describe('POST /api/register', () => {
    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able register new user', async () => {
        const response = await supertest(app)
            .post("/api/register")
            .send({
                username: "test",
                email: "test@gmail.com",
                password: "test"
            })

        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.username).toBe("test")
        expect(response.body.data.email).toBe("test@gmail.com")
    })

    it('should reject register user if data is invalid', async () => {
        const response = await supertest(app)
            .post("/api/register")
            .send({
                username: "",
                email: "",
                password: ""
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})
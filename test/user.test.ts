import supertest from "supertest"
import { UserTest } from "./testUtility"
import { app } from "../src/app/service"
import bcrypt from "bcrypt"

describe('POST /api/register', () => {
    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able register new user', async () => {
        const response = await supertest(app)
            .post("/api/register")
            .send({
                name: "example",
                phone: "+628123456789",
                email: "example@gmail.com",
                password: "Example@2003",
                role: "ADMIN"
            })

        expect(response.status).toBe(201)
        expect(response.body.data.name).toBe("example")
        expect(response.body.data.phone).toBe("+628123456789")
        expect(response.body.data.email).toBe("example@gmail.com")
    })

    it('should reject register user if data is invalid', async () => {
        const response = await supertest(app)
            .post("/api/register")
            .send({
                name: "",
                email: "",
                password: ""
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/users', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to get user', async () => {
        const response = await supertest(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.data.name).toBe("example")
        expect(response.body.data.phone).toBe("+628123456789")
        expect(response.body.data.email).toBe("example@gmail.com")
    })

    it('should reject get user if token is invalid', async () => {
        const response = await supertest(app)
            .get("/api/users")
            .set("Authorization", `Bearer error`)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject get user if token is missing', async () => {
        const response = await supertest(app)
            .get("/api/users")

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('PATCH /api/users', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to update user', async () => {
        const response = await supertest(app)
            .patch("/api/users")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "cobacoba",
                phone: "+628123456789",
                password: "Coba@2003"
            })

        expect(response.status).toBe(200)
        expect(response.body.data.name).toBe("cobacoba")
        expect(response.body.data.phone).toBe("+628123456789")

        const user = await UserTest.get()
        expect(await bcrypt.compare("Coba@2003", user.password)).toBe(true)
    })

    it('should reject update user if data is invalid', async () => {
        const response = await supertest(app)
            .patch("/api/users")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "t",
                phone: "21",
                password: "tt"
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update user if token is invalid', async () => {
        const response = await supertest(app)
            .patch("/api/users")
            .set("Authorization", `Bearer salah`)
            .send({
                name: "test",
                phone: "22",
                password: "test"
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('POST /api/login', () => {
    beforeEach(async () => {
        await UserTest.create()
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to login', async () => {
        const response = await supertest(app)
            .post("/api/login")
            .send({
                email: "example@gmail.com",
                password: "Example@2003"
            })

        expect(response.status).toBe(200)
        expect(response.body.data.name).toBe("example")
        expect(response.body.data.email).toBe("example@gmail.com")
        expect(response.body.data.token).toBeDefined()
    })

    it('should reject login if Email is invalid', async () => {
        const response = await supertest(app)
            .post("/api/login")
            .send({
                email: "exampli@gmail.com",
                password: "Example@2003"
            })

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject login if Password is invalid', async () => {
        const response = await supertest(app)
            .post("/api/login")
            .send({
                email: "example@gmail.com",
                password: "exampe"
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/logout', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await UserTest.delete()
    })

    it('should be able to logout', async () => {
        const response = await supertest(app)
            .delete("/api/logout")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")

        const user = await UserTest.get()
        expect(user.token).toBeNull() 
    })

    it('should reject logout if token is invalid', async () => {
        const response = await supertest(app)
            .delete("/api/delete")
            .set("Authorization", `Bearer salah`)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})
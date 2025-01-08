import supertest from "supertest"
import { app } from "../src/app/service"
import { CategoryTest, UserTest } from "./testUtility"

describe('POST /api/categories', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await UserTest.delete()
        await CategoryTest.delete()
    })

    it('should be able to create category', async () => {
        const response = await supertest(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "test"
            })

        expect(response.status).toBe(201)
        expect(response.body.data.name).toBe("test")
    })

    it('should reject create category if data is invalid', async () => {
        const response = await supertest(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: ""
            })
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject create category if token is invalid', async () => {
        const response = await supertest(app)
            .post("/api/categories")
            .set("Authorization", `Bearer test`)
            .send({
                name: "test"
            })
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/categories/:id', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        await CategoryTest.create(userId)
    })

    afterEach(async () => {
        await UserTest.delete()
        await CategoryTest.delete()
    })

    it('should be able to get category', async () => {
        const category = await CategoryTest.get(userId)
        const response = await supertest(app)
            .get(`/api/categories/${category.id}`)
            .set("Authorization", `Bearer ${token}`)
        
        expect(response.status).toBe(200)
        expect(response.body.data.name).toBe("test")
    })

    it('should reject get todo if token is invalid', async () => {
        const category = await CategoryTest.get(userId)
        const response = await supertest(app)
            .get(`/api/categories/${category.id}`)
            .set("Authorization", `Bearer salah`)
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/categories', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id

        await CategoryTest.create(userId, { name: "test" })
        await CategoryTest.create(userId, { name: "example" })
    })

    afterEach(async () => {
        await UserTest.delete()
        await CategoryTest.delete()
    })

    it('should be able to get all category', async () => {
        const response = await supertest(app)
            .get(`/api/categories`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data).toHaveLength(2)

        const [category1, category2] = response.body.data

        expect(category1.name).toBe("test")

        expect(category2.name).toBe("example")
    })

    it('should reject get all category if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/categories`)
            .set("Authorization", `Bearer ytest`)

        expect(response.status).toBe(400)
        expect(Array.isArray(response.body.errors)).toBeDefined()
    })
})

describe('PATCH /api/categories/:id', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        await CategoryTest.create(userId)
    })

    afterEach(async () => {
        await UserTest.delete()
        await CategoryTest.delete()
    })

    it('should be able to update category', async () => {
        const category = await CategoryTest.get(userId)
        const response = await supertest(app)
            .patch(`/api/categories/${category.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "update"
            })
            console.log('Response status:', response.status)
            console.log('Response body:', response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.name).toBe("update")
    })

    it('should reject update category if token is invalid', async () => {
        const category = await CategoryTest.get(userId)
        const response = await supertest(app)
            .patch(`/api/categories/${category.id}`)
            .set("Authorization", `Bearer salah`)
            .send({
                name: "update"
            })
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update category if data is invalid', async () => {
        const category = await CategoryTest.get(userId)
        const response = await supertest(app)
            .patch(`/api/categories/${category.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: ""
            })
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/categories/:id', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        await CategoryTest.create(userId)
    })

    afterEach(async () => {
        await UserTest.delete()
        await CategoryTest.delete()
    })

    it('should be able to category', async () => {
        const category = await CategoryTest.get(userId)
        const response = await supertest(app)
            .delete(`/api/categories/${category.id}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject category if token is invalid', async () => {
        const category = await CategoryTest.get(userId)
        const response = await supertest(app)
            .delete(`/api/categories/${category.id}`)
            .set("Authorization", `Bearer token`)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject category if category id is invalid', async () => {
        const response = await supertest(app)
            .delete(`/api/categories/categoryId`)
            .set("Authorization", `Bearer token`)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})
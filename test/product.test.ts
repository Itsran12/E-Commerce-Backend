import supertest from "supertest"
import { app } from "../src/app/service"
import { CategoryTest, ProductTest, UserTest } from "./testUtility"

describe('POST /api/products', () => {
    let token: string
    let categoryId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!

        const category = await CategoryTest.create(user.id)
        categoryId = category.id
    })

    afterEach(async () => {
        await UserTest.delete()
        await ProductTest.delete()
        await CategoryTest.delete()
    })

    it('should be able to create product', async () => {
        const response = await supertest(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
                categoryId: categoryId,
                name: "test",
                description: "test",
                price: 10000,
                stock: 10
            })

        expect(response.status).toBe(201)
        expect(response.body.data.name).toBe("test")
        expect(response.body.data.description).toBe("test")
        expect(response.body.data.price).toBe(10000)
        expect(response.body.data.stock).toBe(10)
    })

    it('should reject create product if data is invalid', async () => {
        const response = await supertest(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "",
                description: "",
                price: "",
                stock: "",
            })
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject create product if token is invalid', async () => {
        const response = await supertest(app)
            .post("/api/products")
            .set("Authorization", `Bearer test`)
            .send({
                name: "",
                description: "",
                price: "",
                stock: "",
            })
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/products/:id', () => {
    let token: string
    let categoryId: string
    let productId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        
        const category = await CategoryTest.create(user.id)
        categoryId = category.id
        
        const product = await ProductTest.create(categoryId)
        productId = product.id
    })

    afterEach(async () => {
        await ProductTest.delete()
        await CategoryTest.delete()
        await UserTest.delete()
    })

    it('should be able to get product by id', async () => {
        const response = await supertest(app)
            .get(`/api/products/${productId}`)
            .set("Authorization", `Bearer ${token}`)
        
        expect(response.status).toBe(200)
        expect(response.body.data.name).toBe("test")
    })

    it('should reject get product if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/products/${productId}`)
            .set("Authorization", `Bearer salah`)
        
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/products', () => {
    let token: string
    let categoryId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!

        const category = await CategoryTest.create(user.id)
        categoryId = category.id
        
        await ProductTest.create(categoryId, {
            name: "test",
            description: "test",
            price: 1000,
            stock: 10
        })

        await ProductTest.create(categoryId, {
            name: "example",
            description: "example",
            price: 2000,
            stock: 20
        })
    })

    afterEach(async () => {
        await ProductTest.delete()
        await CategoryTest.delete()
        await UserTest.delete()
    })

    it('should be able to get all products', async () => {
        const response = await supertest(app)
            .get(`/api/products`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data).toHaveLength(2)

        const [product1, product2] = response.body.data

        expect(product1.name).toBe("test")
        expect(product1.description).toBe("test")
        expect(product1.price).toBe(1000)
        expect(product1.stock).toBe(10)

        expect(product2.name).toBe("example")
        expect(product2.description).toBe("example")
        expect(product2.price).toBe(2000)
        expect(product2.stock).toBe(20)
    })

    it('should reject get all category if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/categories`)
            .set("Authorization", `Bearer ytest`)

        expect(response.status).toBe(400)
        expect(Array.isArray(response.body.errors)).toBeDefined()
    })
})

describe('PATCH /api/products/:id', () => {
    let token: string
    let categoryId: string
    let productId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        const category = await CategoryTest.create(user.id)
        categoryId = category.id
        const product = await ProductTest.create(categoryId)
        productId = product.id
    })

    afterEach(async () => {
        await ProductTest.delete()
        await CategoryTest.delete()
        await UserTest.delete()
    })

    it('should be able to update product', async () => {
        const response = await supertest(app)
            .patch(`/api/products/${productId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "updated",
                description: "updated",
                price: 2000,
                stock: 20
            })

        expect(response.status).toBe(200)
        expect(response.body.data.name).toBe("updated")
        expect(response.body.data.description).toBe("updated")
        expect(response.body.data.price).toBe(2000)
        expect(response.body.data.stock).toBe(20)
    })

    it('should reject update product if token is invalid', async () => {
        const response = await supertest(app)
            .patch(`/api/products/${productId}`)
            .set("Authorization", `Bearer invalid`)
            .send({
                name: "updated",
                description: "updated",
                price: 2000,
                stock: 20
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update product if data is invalid', async () => {
        const response = await supertest(app)
            .patch(`/api/products/${productId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "",
                description: "",
                price: "",
                stock: ""
            })

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/products/:id', () => {
    let token: string
    let categoryId: string
    let productId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        const category = await CategoryTest.create(user.id)
        categoryId = category.id
        const product = await ProductTest.create(categoryId)
        productId = product.id
    })

    afterEach(async () => {
        await ProductTest.delete()
        await CategoryTest.delete()
        await UserTest.delete()
    })

    it('should be able to delete product', async () => {
        const response = await supertest(app)
            .delete(`/api/products/${productId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject delete product if token is invalid', async () => {
        const response = await supertest(app)
            .delete(`/api/products/${productId}`)
            .set("Authorization", `Bearer token`)

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject delete product if product id is invalid', async () => {
        const response = await supertest(app)
            .delete(`/api/products/invalidProductId`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404)
        expect(response.body.errors).toBeDefined()
    })
})




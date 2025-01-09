import supertest from "supertest"
import { app } from "../src/app/service"
import { ColorTest, UserTest } from "./testUtility"

// describe('POST /api/colors', () => {
//     let token: string

//     beforeEach(async () => {
//         const user = await UserTest.create()
//         token = user.token!
//     })

//     afterEach(async () => {
//         await UserTest.delete()
//         await ColorTest.delete()
//     })

//     it('should be able to create color', async () => {
//         const response = await supertest(app)
//             .post("/api/colors")
//             .set("Authorization", `Bearer ${token}`)
//             .send({
//                 name: "test",
//                 hexCode:"test"
//             })

//         expect(response.status).toBe(201)
//         expect(response.body.data.name).toBe("test")
//         expect(response.body.data.hexCode).toBe("test")
//     })

//     it('should reject create colors if data is invalid', async () => {
//         const response = await supertest(app)
//             .post("/api/colors")
//             .set("Authorization", `Bearer ${token}`)
//             .send({
//                 name: "",
//                 hexCode:""
//             })
        
//         expect(response.status).toBe(400)
//         expect(response.body.errors).toBeDefined()
//     })

//     it('should reject create colors if token is invalid', async () => {
//         const response = await supertest(app)
//             .post("/api/colors")
//             .set("Authorization", `Bearer test`)
//             .send({
//                 name: "test",
//                 hexCode:"test"
//             })
        
//         expect(response.status).toBe(400)
//         expect(response.body.errors).toBeDefined()
//     })
// })

// describe('GET /api/colors', () => {
//     let token: string;

//     beforeEach(async () => {
//         const user = await UserTest.create();
//         token = user.token!;

//         await ColorTest.create({ name: "test", hexCode: "#123456" });
//         await ColorTest.create({ name: "example", hexCode: "#abcdef" });
//     });

//     afterEach(async () => {
//         await UserTest.delete();
//         await ColorTest.delete();
//     });

//     it('should be able to get all colors', async () => {
//         const response = await supertest(app)
//             .get(`/api/colors`)
//             .set("Authorization", `Bearer ${token}`);

//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body.data)).toBe(true);
//         expect(response.body.data).toHaveLength(2);

//         const [color1, color2] = response.body.data;

//         expect(color1.name).toBe("test");
//         expect(color1.hexCode).toBe("#123456");

//         expect(color2.name).toBe("example");
//         expect(color2.hexCode).toBe("#abcdef");
//     });

//     it('should reject get all colors if token is invalid', async () => {
//         const response = await supertest(app)
//             .get(`/api/colors`)
//             .set("Authorization", `Bearer invalidtoken`);

//         expect(response.status).toBe(400);
//         expect(response.body.errors).toBeDefined();
//     });
// });


describe('PATCH /api/colors/:id', () => {
    let token: string;
    let colorId: string;  

    beforeEach(async () => {
        const user = await UserTest.create();
        token = user.token!;
        const color = await ColorTest.create();
        colorId = color.id;
    });

    afterEach(async () => {
        await UserTest.delete();
        await ColorTest.delete();
    });

    it('should be able to update color', async () => {
        const response = await supertest(app)
            .patch(`/api/colors/${colorId}`) 
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "update",
                hexCode: "update"
            });

        console.log('Response status:', response.status);
        console.log('Response body:', response.body);

        // Pastikan statusnya 200
        expect(response.status).toBe(200);
        // Pastikan data yang diupdate sesuai dengan input
        expect(response.body.data.name).toBe("updatedColor");
        expect(response.body.data.hexCode).toBe("#654321");
    });


    // it('should reject update color if token is invalid', async () => {
    //     const color = await ColorTest.get();
    //     const response = await supertest(app)
    //         .patch(`/api/colors/${color.id}`)
    //         .set("Authorization", `Bearer salah`)
    //         .send({
    //             name: "updatedColor",
    //             hexCode: "#654321"
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body.errors).toBeDefined();
    // });

    // it('should reject update color if data is invalid', async () => {
    //     const color = await ColorTest.get();
    //     const response = await supertest(app)
    //         .patch(`/api/colors/${color.id}`)
    //         .set("Authorization", `Bearer ${token}`)
    //         .send({
    //             name: "",
    //             hexCode: "invalidHex"
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body.errors).toBeDefined();
    // });
});

// describe('DELETE /api/colors/:id', () => {
//     let token: string;

//     beforeEach(async () => {
//         const user = await UserTest.create();
//         token = user.token!;
//         await ColorTest.create();
//     });

//     afterEach(async () => {
//         await UserTest.delete();
//         await ColorTest.delete();
//     });

//     it('should be able to delete color', async () => {
//         const color = await ColorTest.get();
//         const response = await supertest(app)
//             .delete(`/api/colors/${color.id}`)
//             .set("Authorization", `Bearer ${token}`);

//         expect(response.status).toBe(200);
//         expect(response.body.data).toBe("OK");
//     });

//     it('should reject delete color if token is invalid', async () => {
//         const color = await ColorTest.get();
//         const response = await supertest(app)
//             .delete(`/api/colors/${color.id}`)
//             .set("Authorization", `Bearer token`);

//         expect(response.status).toBe(400);
//         expect(response.body.errors).toBeDefined();
//     })
// });

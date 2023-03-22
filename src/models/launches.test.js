const supertest = require("supertest");
const app = require("../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await supertest(app).get("/launches");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test POST /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await supertest(app).post("/launches").send({
      mission: "",
    });
  });
});

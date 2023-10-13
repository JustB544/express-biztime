process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const seed = require("./seed");

beforeEach(() => {
    seed();
});

describe("GET /industries", function() {
    test("Gets all industries", async function() {
      const resp = await request(app).get(`/industries`);
      expect(resp.statusCode).toBe(200);
  
      expect(resp.body.length).toEqual(2);
      expect(resp.body[0]).toEqual({
        "code": "tech",
        "industry": "Technology"
      });
    });

    test("Gets a specific industry", async function() {
      const resp = await request(app).get(`/industries/tech`);
      expect(resp.statusCode).toBe(200);
  
      expect(resp.body.industry.code).toEqual("tech");
      expect(resp.body.industry.companies.length).toEqual(2);
    });
});

describe("POST /industries", function() {
  test("Adds a new industry", async function() {
    const resp = await request(app)
    .post(`/industries`)
    .send({code: "test1", industry: "testyboi"});
    expect(resp.statusCode).toBe(201);
    expect(resp.body.industry).toEqual({code: "test1", industry: "testyboi"});
  });
});

describe("PUT /industries/:code", function() {
  test("Updates a industry", async function() {
    const resp = await request(app)
    .put(`/industries/test`)
    .send({industry: "not Testing"});
    expect(resp.statusCode).toBe(200);
    expect(resp.body.industry).toEqual({code: "test", industry: "not Testing"});
  });
});

describe("DELETE /industries/:code", function() {
  test("Deletes a industry", async function() {
    const resp = await request(app).delete(`/industries/test`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({status: "deleted"});
    const test = await request(app).get(`/companies/code`);
    expect(test.body.company.industry).toEqual(null);
  });
});
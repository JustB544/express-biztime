process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const seed = require("./seed");

beforeEach(() => {
    seed();
});

describe("GET /companies", function() {
    test("Gets all companies", async function() {
      const resp = await request(app).get(`/companies`);
      expect(resp.statusCode).toBe(200);
  
      expect(resp.body.length).toEqual(3);
      expect(resp.body[0]).toEqual({
		"code": "apple",
		"name": "Apple Computer",
		"description": "Maker of OSX.",
		"industry": "tech"
	});
    });

    test("Gets a specific company", async function() {
      const resp = await request(app).get(`/companies/apple`);
      expect(resp.statusCode).toBe(200);
  
      expect(resp.body.company.code).toEqual("apple");
      expect(resp.body.company.invoices.length).toEqual(3);
    });
});

describe("POST /companies", function() {
  test("Adds a new company", async function() {
    const resp = await request(app)
    .post(`/companies`)
    .send({code: "test", name: "testyboi"});
    expect(resp.statusCode).toBe(201);
    expect(resp.body.company).toEqual({code: "test", name: "testyboi", description: null, industry: null});
  });
});

describe("PUT /companies/:code", function() {
  test("Updates a company", async function() {
    const resp = await request(app)
    .put(`/companies/code`)
    .send({name: "not name"});
    expect(resp.statusCode).toBe(200);
    expect(resp.body.company).toEqual({code: "code", name: "not name", description: "description", industry: "test"});
  });
});

describe("DELETE /companies/:code", function() {
  test("Deletes a company", async function() {
    const resp = await request(app).delete(`/companies/code`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({status: "deleted"});
  });
});
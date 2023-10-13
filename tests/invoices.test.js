process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const seed = require("./seed");

beforeEach(() => {
    seed();
});

describe("GET /invoices", function() {
    test("Gets all invoices", async function() {
      const resp = await request(app).get(`/invoices`);
      expect(resp.statusCode).toBe(200);
  
      expect(resp.body.length).toEqual(5);
      expect(resp.body[0]).toEqual({
        "id": 1,
        "comp_code": "apple"
      });
    });

    test("Gets a specific invoice", async function() {
      const resp = await request(app).get(`/invoices/5`);
      expect(resp.statusCode).toBe(200);
  
      expect(resp.body.invoice.amt).toEqual(500);
      expect(resp.body.invoice.company.code).toEqual("code");
    });
});

describe("POST /invoices", function() {
  test("Adds a new invoice", async function() {
    const resp = await request(app)
    .post(`/invoices`)
    .send({comp_code: "code", amt: 20});
    expect(resp.statusCode).toBe(201);
    expect(resp.body.invoice.amt).toEqual(20);
  });
});

describe("PUT /invoices/:id", function() {
  test("Updates a invoice", async function() {
    const resp = await request(app)
    .put(`/invoices/5`)
    .send({amt: 21, paid: true});
    expect(resp.statusCode).toBe(200);
    expect(resp.body.invoice.amt).toEqual(21);
    expect(resp.body.invoice.paid).toEqual(true);
  });
});

describe("DELETE /invoices/:code", function() {
  test("Deletes a invoice", async function() {
    const resp = await request(app).delete(`/invoices/5`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({status: "deleted"});
  });
});
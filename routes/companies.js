const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");


router.get("/", async (req, res, next) => {
    const results = await db.query("SELECT * FROM companies;");
    return res.send(results.rows);
});

router.get("/:code", async (req, res, next) => {
    // const results = await db.query("SELECT * FROM companies WHERE code=$1;", [req.params.code]);
    // if (results.rows.length === 0){
    //     return next();
    // }
    // return res.send({companies: results.rows[0]});

    const company = await db.query("SELECT * FROM companies WHERE code=$1;", [req.params.code]);
    if (company.rows.length === 0){
        return next();
    }
    const invoices = await db.query("SELECT * FROM invoices WHERE comp_code=$1", [company.rows[0].code]);
    company.rows[0].invoices = invoices.rows;
    return res.send({company: company.rows[0]});
});

router.post("/", async (req, res, next) => {
    const json = req.body;
    if (json.code === undefined || json.name === undefined){
        return next(new ExpressError("Bad Request", 400));
    }
    try {
        const results = await db.query("INSERT INTO companies (code, name, description) VALUES ($1, $2, $3);", [json.code, json.name, json.description])
        return res.status(201).send({company: {code: json.code, name: json.name, description: json.description}});
    }
    catch(e) {
        return next(new ExpressError("Forbidden", 403, e));
    }
});

router.put("/:code", async (req, res, next) => {
    const json = req.body;
    if (json.name === undefined){
        return next(new ExpressError("Bad Request", 400));
    }
    try {
        const results = await db.query("UPDATE companies SET name=$2, description=$3 WHERE code=$1 RETURNING code;", [req.params.code, json.name, json.description]);
        if (results.rows.length === 0){
            return next();
        }
        return res.status(200).send({company: {code: req.params.code, name: json.name, description: json.description}});
    }
    catch(e) {
        return next(new ExpressError("Forbidden", 403, e));
    }
});

router.delete("/:code", async (req, res, next) => {
    try {
        const _try = await db.query("SELECT * FROM companies WHERE code=$1", [req.params.code]);
        if (_try.rows.length === 0){
            return next();
        }
        const results = await db.query("DELETE FROM companies WHERE code=$1;", [req.params.code]);
        return res.send({status: "deleted"});
    }
    catch{
        return next(e);
    }
});

module.exports = router;

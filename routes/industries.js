const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");


router.get("/", async (req, res, next) => {
    const results = await db.query("SELECT * FROM industries;");
    return res.send(results.rows);
});

router.get("/:code", async (req, res, next) => {
    const code = slugify(req.params.code);

    const industry = await db.query("SELECT * FROM industries WHERE code=$1;", [code]);
    if (industry.rows.length === 0){
        return next();
    }
    const companies = await db.query("SELECT code FROM companies WHERE industry=$1", [industry.rows[0].code]);
    industry.rows[0].companies = companies.rows.map(c => c.code);
    return res.send({industry: industry.rows[0]});
});

router.post("/", async (req, res, next) => {
    const json = req.body;
    if (json.code === undefined || json.industry === undefined){
        return next(new ExpressError("Bad Request", 400));
    }
    const code = slugify(json.code);
    try {
        const results = await db.query("INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry;", [code, json.industry])
        return res.status(201).send({industry: results.rows[0]});
    }
    catch(e) {
        return next(new ExpressError("Forbidden", 403, e));
    }
});

router.put("/:code", async (req, res, next) => {
    const json = req.body;
    if (json.industry === undefined){
        return next(new ExpressError("Bad Request", 400));
    }
    const code = slugify(req.params.code);
    try {
        const results = await db.query("UPDATE industries SET industry=$2 WHERE code=$1 RETURNING code, industry;", [code, json.industry]);
        if (results.rows.length === 0){
            return next();
        }
        return res.status(200).send({industry: results.rows[0]});
    }
    catch(e) {
        return next(new ExpressError("Forbidden", 403, e));
    }
});

router.delete("/:code", async (req, res, next) => {
    const code = slugify(req.params.code);
    try {
        const _try = await db.query("SELECT * FROM industries WHERE code=$1", [code]);
        if (_try.rows.length === 0){
            return next();
        }
        const results = await db.query("DELETE FROM industries WHERE code=$1;", [code]);
        return res.send({status: "deleted"});
    }
    catch(e) {
        return next(e);
    }
});

module.exports = router;
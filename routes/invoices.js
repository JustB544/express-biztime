const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");


router.get("/", async (req, res, next) => {
    const results = await db.query("SELECT id, comp_code FROM invoices;");
    return res.send(results.rows);
});

router.get("/:id", async (req, res, next) => {
    const invoices = await db.query("SELECT * FROM invoices WHERE id=$1;", [req.params.id]);
    if (invoices.rows.length === 0){
        return next();
    }
    const company = await db.query("SELECT * FROM companies WHERE code=$1", [invoices.rows[0].comp_code]);
    invoices.rows[0].company = company.rows[0];
    invoices.rows[0].comp_code = undefined;
    return res.send({invoice: invoices.rows[0]});
});

router.post("/", async (req, res, next) => {
    const json = req.body;
    if (json.comp_code === undefined || json.amt === undefined){
        return next(new ExpressError("Bad Request", 400));
    }
    const comp_code = slugify(json.comp_code);
    try {
        const results = await db.query("INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date;", [comp_code, json.amt])
        return res.status(201).send({invoice: results.rows[0]});
    }
    catch(e) {
        return next(new ExpressError("Forbidden", 403, e));
    }
});

router.put("/:id", async (req, res, next) => {
    const json = req.body;
    if (json.amt === undefined && json.paid === undefined){
        return next(new ExpressError("Bad Request", 400));
    }
    try {
        const results = await db.query(`UPDATE invoices SET 
            ${(json.amt === undefined) ? "" : "amt=$2"}
            ${(json.paid === undefined) ? "" : `${(json.amt === undefined) ? "paid=$2": ", paid=$3"}, paid_date=CURRENT_DATE`} 
            WHERE id=$1 RETURNING id, comp_code, amt, paid, add_date, paid_date;`, [req.params.id, json.amt, json.paid].filter((c) => c !== undefined));

        if (results.rows.length === 0){
            return next();
        }
        return res.status(200).send({invoice: results.rows[0]});
    }
    catch(e) {
        return next(new ExpressError("Forbidden", 403, e));
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const _try = await db.query("SELECT * FROM invoices WHERE id=$1", [req.params.id]);
        if (_try.rows.length === 0){
            return next();
        }
        const results = await db.query("DELETE FROM invoices WHERE id=$1;", [req.params.id]);
        return res.send({status: "deleted"});
    }
    catch{
        return next(e);
    }
});

module.exports = router;
const db = require("../db");

const sql = `
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    industry text REFERENCES industries ON DELETE SET NULL
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO industries
  VALUES ('tech', 'Technology'),
         ('test', 'Testing');

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.', 'tech'),
         ('ibm', 'IBM', 'Big blue.', 'tech'),
         ('code', 'name', 'description', 'test');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null),
         ('code', 500, false, null);
`;

async function seed() {
    await db.query(sql);
}

module.exports = seed;
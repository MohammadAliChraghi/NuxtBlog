//////////////////////////////////////////////////////////////////
/// Require //////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const session = require("express-session");
///////////////////////////////////////////////////////////////////
/// Database //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

const con = new Pool({
  user: "postgres",
  password: "2006",
  host: "localhost",
  port: 5432,
  database: "blog"
});

////////////////////////////////////////////////////////////////////
/// SET and USE ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 60 * 60 * 24 * 360, secure: true, httpOnly: true}
  })
);

/////////////////////////////////////////////////////////////////////
/// Middleware //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

function Auth(req, res, next) {
  if (req.session.user !== undefined) {
    console.log("logged");
    next();
  } else {
    console.log("Not Logged");
  }
}

//////////////////////////////////////////////////////////////////
/// Routes ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

///
///  Login & Authonication
///

app.post("/login", (req, res) => {
  const user = { name: req.body.username, pass: req.body.password };
  if (user.name || user.pass) {
    if (user.name.length < 3 || user.pass.length < 6) {
      res.status(401).send(`Username OR Password Length Is Incorrect`);
    } else {
      con
        .query("SELECT * FROM users WHERE name = $1 AND password = $2", [
          user.name,
          user.pass
        ])
        .then(resu => {
          if (resu.rows.length) {
            req.session.user = resu.rows[0];
            res.status(200).send(req.session.user);
          } else {
            res.status(401).send("Username Or Password Is Incorrect");
          }
        })
        .catch(e => console.error(e));
    }
  } else {
    res.status(401).send(`Username And Password Is Undefined`);
  }
});

app.get("/a", (req, res) => {
  res.json(req.session.user);
});

//////////////////////////////////////////////////////////////////
/// Export ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

module.exports = {
  path: "/api",
  handler: app
};

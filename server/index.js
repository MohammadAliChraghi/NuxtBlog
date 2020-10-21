//////////////////////////////////////////////////////////////////
/// Require //////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const SECRET = "MacGeekSECRET";

///////////////////////////////////////////////////////////////////
/// Database //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

mongoose.connect("mongodb://localhost/blog", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  poolSize: 2,
});
const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "error connecting with mongodb database:")
);
db.once("open", function() {
  console.log("Succefult Connected To MongoDB Database");
});
var Schema = mongoose.Schema;
var usersSchema = new Schema({
  _id: mongoose.ObjectId,
  name: String,
  password: String,
});

////////////////////////////////////////////////////////////////////
/// SET and USE ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//////////////////////////////////////////////////////////////////
/// Routes ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

///
///  Login & Authonication
///

app.get("/auth", async (req, res) => {
  try {
    const token = req.headers.authenication;
    if (token !== undefined) {
      const vfy = jwt.verify(token, SECRET);
      if (vfy) {
        const decoded = jwt.decode(token);
        var usersModel = mongoose.model("users", usersSchema);
        await usersModel.findById(decoded._id, function(err, obj) {
          if (err) {
            console.error(err);
            res.status(503).send("Connection Error!");
          } else {
            if (obj) {
              const newT = jwt.sign({ _id: obj._id }, SECRET);
              res.send({ token: newT, _id: obj._id, name: obj.name });
            } else {
              res.status(401).send("User Is Incorrect");
            }
          }
        });
      } else {
        res.status(401).send("Token Is Incorrect");
      }
    } else {
      res.status(401).send();
    }
  } catch (err) {
    console.error(err);
    res.status(401).send("Token Is Incorrect");
  }
});

app.post("/login", async (req, res) => {
  const user = { name: req.body.username, pass: req.body.password };
  if (user.name || user.pass) {
    if (user.name.length < 3 || user.pass.length < 6) {
      res.status(401).send(`Username OR Password Length Is Incorrect`);
    } else {
      var usersModel = mongoose.model("users", usersSchema);
      await usersModel.findOne(
        { name: user.name, password: user.pass },
        function(err, obj) {
          if (err) {
            console.error(err);
            res.status(503).send("Connection Error!");
          } else {
            if (obj) {
              var token = jwt.sign({ _id: obj._id }, SECRET);
              res.status(200).send(token);
            } else {
              res.status(401).send("Username Or Password Is Incorrect");
            }
          }
        }
      );
    }
  } else {
    res.status(401).send(`Username And Password Is Undefined`);
  }
});

//////////////////////////////////////////////////////////////////
/// Export ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

module.exports = {
  path: "/api",
  handler: app,
};

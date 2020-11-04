//////////////////////////////////////////////////////////////////
/// Require //////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "static/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); //Appending extension
  },
});

const upload = multer({ storage: storage });
const db = require("./db");
const SECRET = "MacGeekSECRET";

////////////////////////////////////////////////////////////////////
/// SET and USE ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
// Middleware
//

app.use(async (req, res, next) => {
  if (req.originalUrl !== "/api/login") {
    try {
      let token = await req.headers.authorization;
      if (token) {
        const verify = jwt.verify(token, SECRET);
        if (verify) {
          next();
        } else {
          console.warn("Token Is Incorrect!");
          res.status(401).send();
        }
      } else {
        console.warn("Token Not Found!");
        res.status(401).send();
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    next();
  }
});

//////////////////////////////////////////////////////////////////
/// Routes ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

///
///  Login & authorization
///

app.get("/auth", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.decode(token);
    if (decoded.id) {
      await db.query(
        "SELECT * FROM users WHERE id = $1",
        [decoded.id],
        function(err, obj) {
          if (err) {
            console.error(err);
            res.status(503).send("Connection Error!");
          } else {
            if (obj.rows) {
              const newT = jwt.sign({ id: obj.rows[0].id }, SECRET);
              res.send({
                token: newT,
                user: obj.rows[0],
              });
            } else {
              res.status(401).send("User Is Incorrect");
            }
          }
        }
      );
    } else {
      res.status(401).send();
    }
  } catch (err) {
    console.error(err);
    res.status(401).send("Token Is Incorrect");
  }
});

app.post("/login", async (req, res) => {
  const user = { username: req.body.username, pass: req.body.password };
  if (user.username && user.pass) {
    if (user.username.length < 3 || user.pass.length < 6) {
      res.status(401).send(`Username OR Password Length Is Incorrect`);
    } else {
      await db.query(
        "SELECT * FROM users WHERE username = $1 AND password = $2",
        [user.username, user.pass],
        function(err, obj) {
          if (err) {
            console.error(err);
            res.status(503).send("Connection Error!");
          } else {
            if (obj.rows.length) {
              var token = jwt.sign({ id: obj.rows[0].id }, SECRET);
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

///
///  Statics
///

app.post("/statics/visits", (req, res) => {
  db.query(
    `INSERT INTO public.visits(
    date)
    VALUES ($1)`,
    [
      new Date()
        .toLocaleDateString()
        .split("/")
        .join("-"),
    ]
  );
  res.end();
});

app.get("/statics/visits/:year?/:month?/:day?", (req, res) => {
  if (req.params.year !== undefined) {
    if (req.params.month !== undefined) {
      if (req.params.day !== undefined) {
        db.query(
          "SELECT * FROM visits WHERE extract(day from visits.date) = $1 AND extract(month from visits.date) = $2 AND extract(year from visits.date) = $3",
          [req.params.day, req.params.month, req.params.year]
        ).then((r) => {
          if (req.headers.type === "rows") res.send(r.rows);
          else res.send(r.rowCount.toString());
        });
      } else {
        db.query(
          "SELECT * FROM visits WHERE extract(month from visits.date) = $1 AND extract(year from visits.date) = $2",
          [req.params.month, req.params.year]
        ).then((r) => {
          if (req.headers.type === "rows") res.send(r.rows);
          else res.send(r.rowCount.toString());
        });
      }
    } else {
      db.query(
        "SELECT * FROM visits WHERE extract(year from visits.date) = $1",
        [req.params.year]
      ).then((r) => {
        if (req.headers.type === "rows") res.send(r.rows);
        else res.send(r.rowCount.toString());
      });
    }
  } else {
    db.query("SELECT * FROM visits").then((r) => {
      if (req.headers.type === "rows") res.send(r.rows);
      else res.send(r.rowCount.toString());
    });
  }
});

///
///  Users
///

app.get("/users/:id?", (req, res) => {
  if (req.params.id !== undefined) {
    if (req.params.id.length) {
      db.query("SELECT * FROM users WHERE id = $1", [req.params.id]).then(
        (r) => {
          if (r.rows.length) {
            res.send(r.rows);
          } else {
            res.status(204).send();
          }
        }
      );
    }
  } else {
    if (req.headers.limit !== undefined) {
      db.query("SELECT * FROM users ORDER BY id DESC LIMIT $1", [
        req.headers.limit,
      ]).then((r) => {
        res.send(r.rows);
      });
    } else {
      db.query("SELECT * FROM users").then((r) => {
        res.send(r.rows);
      });
    }
  }
});

app.post("/users/:id?", (req, res) => {
  if (req.body.type === "UPDATE") {
    if (req.params.id !== undefined) {
      if (req.body.user) {
        let user = req.body.user;
        db.query(
          "UPDATE users SET username = $1, password = $2, role = $3 WHERE id = $4",
          [user.username, user.password, user.role, user.id]
        )
          .then((r) => {
            res.send(r.rows);
          })
          .catch((e) => {
            console.error(e);
            res.status(503).send();
          });
      } else {
        res.status(403).send();
      }
    } else {
      res.status(403).send();
    }
  } else {
    if (req.body.user) {
      let user = req.body.user;
      db.query(
        "INSERT INTO users (username, password, role) VALUES ($1,$2,$3)",
        [user.username, user.password, user.role]
      )
        .then((r) => {
          res.send();
        })
        .catch((e) => {
          console.error(e);
          res.status(503).send();
        });
    } else {
      res.status(403).send();
    }
  }
});

app.delete("/users/:id", (req, res) => {
  if (req.params.id) {
    db.query("DELETE FROM users WHERE id = $1", [req.params.id])
      .then((r) => {
        res.send();
      })
      .catch((e) => {
        console.error(req.params.id);
        res.status(503).send();
      });
  }
});

///
/// Posts
///

app.get("/posts/:id?", (req, res) => {
  if (!req.params.id) {
    if (req.headers.limit !== undefined) {
      db.query("SELECT * FROM posts ORDER BY id DESC LIMIT $1", [
        req.headers.limit,
      ])
        .then((r) => {
          if (r.rows.length) {
            res.send(r.rows);
          }
        })
        .catch((e) => {
          console.error(e);
          res.status(204).send();
        });
    } else {
      db.query("SELECT * FROM posts ORDER BY id DESC")
        .then((r) => {
          if (r.rows.length) {
            res.send(r.rows);
          }
        })
        .catch((e) => {
          console.error(e);
          res.status(204).send();
        });
    }
  } else {
    db.query("SELECT * FROM posts WHERE id = $1", [req.params.id])
      .then((r) => {
        if (r.rows.length) {
          res.send(r.rows);
        } else {
          res.status(403).send();
        }
      })
      .catch((e) => {
        console.error(e);
        res.status(403).send();
      });
  }
});

app.delete("/posts/:id", (req, res) => {
  if (req.params.id) {
    db.query("DELETE FROM posts WHERE id = $1", [req.params.id])
      .then((r) => {
        res.send();
      })
      .catch((e) => {
        console.error(req.params.id);
        res.status(503).send();
      });
  }
});

app.post("/posts/update/:id?", upload.single("image"), (req, res) => {
  const post = JSON.parse(req.body.post);
  db.query(
    "UPDATE posts SET title = $1, text = $2, thumbnail = $3 WHERE id = $4",
    [post.title, post.text, req.file.originalname, req.params.id]
  ).then((r) => {
    if (r.rowCount) {
      res.send();
    } else {
      res.status(503).send();
      console.log(r);
    }
  });
});

app.post("/posts/:id?", upload.single("image"), (req, res) => {
  const post = JSON.parse(req.body.post);
  db.query(
    "INSERT INTO posts (title, author, text, thumbnail) VALUES ($1,$2,$3,$4)",
    [post.title, post.author, post.text, req.file.originalname]
  ).then((r) => {
    if (r.rowCount) {
      res.send();
    } else {
      res.status(503).send();
      console.log(r);
    }
  });
});

///
///  Search
///

app.get("/search/posts/:word", (req, res) => {
  db.query("SELECT * FROM posts WHERE title ILIKE $1 LIMIT 6", [`%${req.params.word}%`]).then(
    (r) => {
      if (r.rowCount > 0) {
        res.send(r.rows);
      } else {
        console.log(r);
        res.sendStatus(204);
      }
    }
  );
});

//////////////////////////////////////////////////////////////////
/// Export ///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

module.exports = {
  path: "/api",
  handler: app,
};

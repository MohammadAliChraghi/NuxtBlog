const { Client } = require("pg");
const connection = new Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "2006",
  port: 5432,
});
connection.connect();
module.exports = connection;

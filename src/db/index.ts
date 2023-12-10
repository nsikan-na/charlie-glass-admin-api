require("dotenv").config();

const mysql = require("mysql2");

// Create the connection to the database
const connection = mysql.createConnection(process.env.DATABASE_URL);

// simple query
connection.query("show tables", function (err: any, results: any, fields: any) {
  console.log(results); // results contains rows returned by server
  console.log(fields); // fields contains extra metadata about results, if available
});

// Example with placeholders
connection.query(
  "select 1 from dual where ? = ?",
  [1, 1],
  function (err: any, results: any) {
    console.log(results);
  }
);

connection.end();

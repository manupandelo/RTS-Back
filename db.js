import 'dotenv/config'
import mysql from 'mysql2/promise'

var con = await mysql.createConnection({
  host: process.env.server,
  user: process.env.user,
  password: process.env.pass,
  database: process.env.base,
  port: process.env.port
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});

export default con;
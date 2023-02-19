import 'dotenv/config'
import mysql from 'mysql2/promise'

var con = await mysql.createConnection({
  host: "containers-us-west-130.railway.app",
  user: "root",
  password: "VYFuw6SezDm45Zlg52PN",
  database: "railway",
  port: "7990"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});

export default con;
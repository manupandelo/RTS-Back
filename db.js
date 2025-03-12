import 'dotenv/config'
import mysql from 'mysql2/promise'
import fs from 'fs'

var con = await mysql.createConnection({
  host: '34.31.206.176',
  user: 'sebas',
  password: 'manu',
  database: 'RTS',
  port: 3306,
  ssl: { ca: fs.readFileSync('ssl/server-ca.pem'),
    cert: fs.readFileSync('ssl/client-cert.pem'),
    key: fs.readFileSync('ssl/client-key.pem'),
    secureProtocol: 'TLSv1_2_method' 
  } 
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});

export default con;
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2";

const app = express();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sally",
  database: "bibliotheke",
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;

app.get("/", (req, res) => {
  const sqlSelect = "SELECT * FROM `books`";

  db.query(sqlSelect, (err, result) => {
    console.log(result);
  });
});

app.listen(port, () => {
  console.log(`server is running on Port ${port}`);
});

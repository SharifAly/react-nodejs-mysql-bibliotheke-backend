import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";

const app = express();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "react_bibliotheke",
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 4000;

app.get("/book/all", (req, res) => {
  const sqlSelect = "SELECT * FROM `books`";

  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.post("/book/insert", (req, res) => {
  const Title = req.body.Title;
  const Description = req.body.Description;
  const Cover = req.body.Cover;
  const Price = req.body.Price;

  const sqlInsert =
    "INSERT INTO `books`(`Title`, `Description`, `Cover`, `Price`) VALUES (?, ?, ?, ?)";

  db.query(sqlInsert, [Title, Description, Cover, Price], (err, result) => {
    console.log(result);
  });
});

app.delete("/book/delete/:id", (req, res) => {
  const id = req.params.id;

  const sqlDelete = "DELETE FROM `books` WHERE Book_ID = ?";

  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting book");
    } else {
      console.log(result);
      res.send("Book deleted successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`server is runnin on Port ${port}`);
});

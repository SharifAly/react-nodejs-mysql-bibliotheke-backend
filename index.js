import express from "express";
import mysql from "mysql2";
import cors from "cors";

// Initialze the s

const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;

// Create MySQL connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "react_bibliotheke",
});

// Routes and Middleware

// Route to print all data from "books"
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (error, results) => {
    if (error) {
      console.error("Error querying the database:", error);
      res.status(500).send("Error querying the database");
    } else {
      console.log("Database results:", results);
      res.json(results);
    }
  });
});

// Route to create a new book

// Fix the post request

app.post("/books", (req, res) => {
  // const upload = multer({ dest: "uploads/" });

  const values = [req.body.Title, req.body.Description, req.body.Cover];
  db.query(
    "INSERT INTO `books`(`Title`, `Description`, `Cover`) VALUES (?, ?, ?)",
    values,
    (error, results) => {
      if (error) {
        console.error("Error querying the database:", error);
        res.status(500).send("Error querying the database");
      } else {
        res.json(results);
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

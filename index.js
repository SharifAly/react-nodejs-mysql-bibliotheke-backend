import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";

// Initialze the server

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

// Set up storage for uploaded files

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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
app.post("/books", upload.single("file"), (req, res) => {
  // const values = [req.body.Title, req.body.Description, req.file];
  const title = req.body.Title;
  const description = req.body.Description;
  const file = req.file;
  let q = "INSERT INTO books(Title, Description, Cover) VALUES (?, ?, ?)";
  db.query(q, [title, description, file.filename], (error, results) => {
    if (error) {
      console.error("Error querying the database:", error);
      res.status(500).send("Error querying the database");
    } else {
      console.log("Database results:", results);
      res.json(results);
    }
    console.log(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";

// Initialze the server

const app = express();
app.use(cors());
app.use(express.json());
// make the folder available for the client
app.use(express.static("public"));

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
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + path.extname(file.originalname)
    );
  },
});

// Set up upload for multer

const upload = multer({ storage: storage });

// Routes and Middleware

// Route to print all data from "books"
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (error, results) => {
    if (error) {
      console.error("Error querying the database:", error);
      res.status(500).send("Error querying the database");
    } else {
      // console.log("Database results:", results);
      res.json(results);
    }
  });
});

// Route to print a specific book

app.get("/books/:id", (req, res) => {
  let q = "SELECT * FROM books WHERE Book_ID =?";
  let id = req.params.id;
  db.query(q, id, (error, results) => {
    if (error) {
      console.error("Error querying the database:", error);
      res.status(500).send("Error querying the database");
    } else {
      // console.log("Database results:", results);
      res.json(results);
    }
  });
});

// Route to create a new book

app.post("/books", upload.single("file"), (req, res) => {
  const title = req.body.Title;
  const description = req.body.Description;
  const file = req.file;

  let q = "INSERT INTO books(Title, Description, Cover) VALUES (?, ?, ?)";

  db.query(q, [title, description, file.filename], (error, results) => {
    if (error) {
      console.error("Full error:", error);

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Duplicate entry" });
      } else if (error.code === "ER_BAD_NULL_ERROR") {
        return res.status(400).json({ error: "Validation error" });
      } else {
        return res.status(500).json({ error: "Database error" });
      }
    }

    // console.log("Database results:", results);
    res.json(results);
  });
});

// Route to delete a book

app.delete("/books/:id", (req, res) => {
  // Use bookId to delete the book from database
  const bookId = req.params.id;
  const q = "DELETE FROM `books` WHERE `Book_ID` = ?";
  // ... database delete logic
  db.query(q, bookId, (err, res) => {
    if (err) {
      console.error("Full error:", err);
    }
    // else {
    //   console.log("Database results:", res);
    // }
  });

  res.send("Book deleted successfully");
});

// Route to update a book

app.put("/books/:id", upload.single("file"), (req, res) => {
  const bookId = req.params.id;
  const title = req.body.Title;
  const description = req.body.Description;
  const file = req.file;
  let q =
    "UPDATE `books` SET `Book_ID`=?,`Title`=?,`Description`=?,`Cover`=? WHERE Book_ID = ?";
  db.query(
    q,
    [bookId, title, description, file.filename, bookId],
    (err, res) => {
      if (err) {
        console.error("Full error:", err);
      }
      // else {
      //   console.log("Database results:", res);
      // }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

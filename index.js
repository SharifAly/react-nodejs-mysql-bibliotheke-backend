import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
const port = 8000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "react_bibliotheke",
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Connected to the database");
  }
});

// Define your routes and middleware here

// Route to print all data from "books"
app.get("/books", (req, res) => {
  connection.query("SELECT * FROM books", (error, results) => {
    if (error) {
      console.error("Error querying the database:", error);
      res.status(500).send("Error querying the database");
    } else {
      console.log("Database results:", results);
      res.json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

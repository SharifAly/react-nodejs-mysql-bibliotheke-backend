import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse request body
const port = 8000;

// Create MySQL connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "react_bibliotheke",
});

// Connect to the database
// connection.connect((error) => {
//   if (error) {
//     console.error("Error connecting to the database:", error);
//   } else {
//     console.log("Connected to the database");
//   }
// });

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
  const { Title, Description, Cover } = req.body; // Use req.body to access the data that was sent in the post request
  db.query(
    "INSERT INTO `books`(`Title`, `Description`, `Cover`) VALUES (?, ?, ?)", // Update the column names in the query
    [Title, Description, Cover], // Use the correct variable names
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

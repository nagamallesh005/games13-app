const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // change if your MySQL user is different
  password: "Naga12345", // put your MySQL root password
  database: "games13"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// ===== Signup API =====
app.post("/signup", async (req, res) => {
  const { fullName, email, password, inviteCode } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (fullName, email, password, inviteCode) VALUES (?, ?, ?, ?)";
    db.query(sql, [fullName, email, hashedPassword, inviteCode], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Signup successful!" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error hashing password" });
  }
});

// ===== Login API =====
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "Invalid email or password" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful!" });
  });
});

// ===== Start Server =====
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});


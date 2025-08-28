# Games13 App

A simple authentication system using **HTML + CSS + JS (frontend)** and **Node.js + Express + MySQL (backend)**.

## 🚀 How to Run
1. Setup MySQL database:
   ```sql
   CREATE DATABASE games13;
   USE games13;
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     fullName VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     inviteCode VARCHAR(50),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

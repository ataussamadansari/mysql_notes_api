const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conn = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();
const userRouter = express.Router();

// Signup Route
userRouter.post("/signup", async (req, res) => {
    const { name, email, mobile, password } = req.body;

    // Check if the user already exists by email or mobile
    const checkUserQuery = 'SELECT * FROM users WHERE email = ? OR mobile = ?';
    conn.query(checkUserQuery, [email, mobile], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email or mobile number already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const insertQuery = 'INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)';
        conn.query(insertQuery, [name, email, mobile, hashedPassword], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error creating user.', error: err });

            // Create JWT token
            const token = jwt.sign({ id: results.insertId, email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.status(201).json({ message: 'User registered successfully!', token });
        });
    });
});

userRouter.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    conn.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.', error: err });

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = results[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful!', token });
    });
});

// Fetch all users
userRouter.get("/all", (req, res) => {
    const query = 'SELECT id, name, email, mobile FROM users'; // Saare users ki details fetch karne ka query
    
    conn.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching users.', error: err });
        }
        res.json({ users: results }); // Users ki details return karo
    });
});

module.exports = userRouter;
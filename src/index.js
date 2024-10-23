const express = require("express");
const cors = require('cors'); // CORS package import karein
const userRouter = require("./routes/userRoutes");
const notesRouter = require("./routes/notesRoutes");
const conn = require('./config/db');
const dotenv = require('dotenv');

const app = express();

// Load environment variables
dotenv.config();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all origins (agar aap specific origins ko allow karna chahte hain, toh usse customize karein)
app.use(cors());

// Access user and notes Routes
app.use("/api/users", userRouter);
app.use("/api/note", notesRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

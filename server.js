// server.js

// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Set the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// API routes
app.use('/api/auth', authRoutes); // Mount authentication routes

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
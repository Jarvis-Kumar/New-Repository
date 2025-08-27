// routes/auth.js

// Import required packages
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define authentication routes
router.post('/signup', authController.signup); // Route for user signup
router.post('/login', authController.login);   // Route for user login

// Export the router to be used in server.js
module.exports = router;
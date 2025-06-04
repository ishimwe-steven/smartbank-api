const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// If you're not using authMiddleware (token), comment this out
// const authMiddleware = require('../middleware/authMiddleware');

// Route to get current logged-in user's info (requires token authentication)
router.get('/me', userController.getUserInfo); // remove authMiddleware if you don't have it

// Public route to get a user by ID
router.get('/:id', userController.getUserById);

module.exports = router;

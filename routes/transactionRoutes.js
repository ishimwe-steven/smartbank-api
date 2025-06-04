const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Routes
router.post('/send', transactionController.sendMoney);
router.get('/history', transactionController.getTransactionHistory);
router.post('/deposit',  transactionController.deposit);
router.post('/withdraw',  transactionController.withdraw);

module.exports = router;

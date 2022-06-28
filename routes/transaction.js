const express = require('express');
const router  = express.Router(); 

//  Controllers
const transaction = require('../controllers/transaction'); 

// Router
router.get('/send_coin', transaction.send_coin); 
router.post('/swapExactETHForTokens', transaction.swapExactETHForTokens); 
// router.post('/create_user', transaction.create_user); 
// router.put('/update_user', transaction.update_user); 
module.exports = router; // export to use in server.js

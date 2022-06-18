const express = require('express'); //import express
const router  = express.Router(); 

//  Controllers
const user_controller = require('../controllers/user'); 

// Router
router.get('/get_users', user_controller.get_users); 
router.post('/create_user', user_controller.create_user); 
module.exports = router; // export to use in server.js

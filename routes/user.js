const express = require('express');
const router  = express.Router(); 

//  Controllers
const user_controller = require('../controllers/user'); 

// Router
router.get('/', user_controller.get_req); 
router.get('/get_users', user_controller.get_users); 
router.post('/create_user', user_controller.create_user); 
router.put('/update_user', user_controller.update_user); 
module.exports = router; // export to use in server.js

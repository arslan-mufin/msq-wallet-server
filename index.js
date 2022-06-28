require('dotenv').config();

const express = require ('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser')

// DB connection
mongoose.connect(process.env.MONGODB_CONFIG);

const user_routes = require('./routes/user'); 
const transaction_routes = require('./routes/transaction'); 

const app = express();
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json());

//Routes
app.use('/', user_routes); //
app.use('/transaction', transaction_routes); //

const listener = app.listen(process.env.PORT || 5000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
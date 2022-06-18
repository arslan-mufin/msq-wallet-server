// const mongoose = require('mongoose');
const User = require("../models/user")
const get_users = (req, res, next) => {
    res.json({message: "users"}); // dummy function for now
};

const create_user =  async(req, res, next) => {
    const {name, email} = req.body
    console.log(name,email)

    const user = new User({
      name,
      email
    });
    try {
        await user.save();
        res.status(200).send(user);
      } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message});
      }
};

module.exports = {get_users, create_user};
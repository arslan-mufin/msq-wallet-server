const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  wallet:{
    address:{
      type: String,
    },
    privateKey:{
      type: String,
    }
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
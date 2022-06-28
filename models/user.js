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
    private_key:{
      type: String,
    }
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
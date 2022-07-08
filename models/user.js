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
      // required: true,
      // unique:true
    },
    tokens:{
      MSQ:{
        type: Number,
        default: 0
      },
      MSQP:{
        type: Number,
        default: 0
      },
      P2U:{
        type: Number,
        default: 0
      },
    }
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
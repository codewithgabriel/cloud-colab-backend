const { Schema, Types, model }  = require("mongoose");

const UsersSchema = new Schema({
  fullname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: {type: String , required: true},
  password: { type: String, required: true },
  isEmailValidated: { type: Boolean, default: false },
});


const Users = model("users", UsersSchema);

module.exports = Users;

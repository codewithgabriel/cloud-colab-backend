const { Schema, Types, model }  = require("mongoose");


const UsersSchema = new Schema({
  filename: { type: String, required: true, unique: true },
  filepath: { type: String, required: true, unique: true },
  uploadedBy: {type: Types.ObjectId , required: true},
  session: {type: String , required: true}
});


const Files = model("files", UsersSchema);

module.exports = Files;

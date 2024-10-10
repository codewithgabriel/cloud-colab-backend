const express = require("express");
const jwtValidator = require("./jwt_validator");
const Users = require("../models/users");
const ObjectId = require("mongoose").Types.ObjectId;

const route = express.Router();

route.use(jwtValidator);

module.exports = route.use( async (req, res) => {
  try {
    const { _id, email } = req.user;

    const { fullname } = await Users.findOne({ email, _id });
    console.log(fullname);
    res.send({
      _id,
      fullname,
      email,
    });
  } catch (e) {
    console.log(e);
    res.send({ error: true });
  }
});

const express = require("express");
const jwtValidator = require("./jwt_validator");
const Files = require("../models/files");
const ObjectId = require("mongoose").Types.ObjectId;

const route = express.Router();

route.use(jwtValidator);

module.exports = route.use( async (req, res) => {
  try {
    const { meetingId } = req.body;

    const files = await Files.find({ meetingId });
    res.send({
     files
    });
  } catch (e) {
    console.log(e);
    res.send({ error: true });
  }
});

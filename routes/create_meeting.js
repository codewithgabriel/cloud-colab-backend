const express = require('express')
const jwtValidator = require('./jwt_validator');

const route = express.Router() 


route.use(jwtValidator)
module.exports = route.use(function  (req, res) {
    const { token, region } = req.body;
    console.log(`token: ${token} , region: ${region}`)
    const url = `${process.env.VIDEOSDK_API_ENDPOINT}/v2/rooms`;
    const options = {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ region }),
    };
  
    fetch(url, options)
      .then((response) => response.json())
      .then((result) => res.json(result)) // result will contain meetingId
      .catch((error) => console.error("error", error));
  })
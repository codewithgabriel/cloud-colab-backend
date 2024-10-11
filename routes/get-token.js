const express = require('express')
const jwt = require("jsonwebtoken");
const jwtValidator = require('./jwt_validator');

const route = express.Router() 

route.use(jwtValidator)
module.exports = route.use(function (req, res)  {
   try{
    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;
  
    const options = { expiresIn: "10m", algorithm: "HS256" };
  
    const payload = {
      apikey: API_KEY,
      permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
    };
  
    const token = jwt.sign(payload, SECRET_KEY, options);
    console.log(token)
    res.json({ token });
   }catch(err) { 
      console.log(err);
   }
  })
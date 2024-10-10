const express = require('express')
const jwt = require("jsonwebtoken");
const Users = require('../models/users');
const { isPassword , isText , isEmail , signUser  , verifyPassword} = require('../utils/utilities');

const route = express.Router() 
const { APP_SECRET_KEY } = process.env;

module.exports = route.use(async function  (req, res) {
    try {
        const { email, password } = req.body;
        //step 1. validate user infos for correct format
        if (!(isPassword(password) && isEmail(email)))
          throw { message: "Invalid token input" };
    
        //step 2. find the user with the credential
    
        let user = await Users.findOne({ email });
    
        //throw error if the user is not authenticated
        if (!user) throw { message: "Invalid credential" };
    
        if (!(await verifyPassword(password, user.password)))
          throw { message: "Invalid authentication" };
        const { _id  } = user;
    
        const payload = {
          _id,
          email: user.email
        };
        // sign user's payload
        let signedPayload = await signUser(payload);
        // console.log(signedPayload)
    
        res.send({
          error: false,
          reason: "Authentication success",
          type: "USER_AUTH_SUCCESS",
          authToken: signedPayload,
        });
        res.end();
      } catch (err) {
        res.send({ error: true, reason: err.message, type: "USER_AUTH_ERR" });
        res.end();
        // log error
        console.log(err);
      }
});
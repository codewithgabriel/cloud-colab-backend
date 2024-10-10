const express = require('express')
const jwt = require("jsonwebtoken");
const Users = require('../models/users');
const { isPassword , isText , isEmail , hashPassword } = require('../utils/utilities');

const route = express.Router() 


module.exports = route.use(async function  (req, res) {
    try {
        const { fullname, password, email , role } = req.body;
        //step 1. validate user infos for correct format
        if (!(isText(fullname) && isPassword(password) && isEmail(email) && isText(role)))
          throw { reason: "Invalid Token input" };
    
    
        const _hashedPassword = await hashPassword(password);
    
        //step 3. save user
        let user = new Users({ fullname,  password: _hashedPassword, email , role });
        await user.save();
       
    
       
        res.send({
          error: false,
          reason: "User account created",
          type: "USER_ACCT_CREATE",
        });
        res.end();
      } catch (err) {
        console.log(err)
        if (err.code == 11000) {
          res.send({
            error: true,
            reason: "User already exist",
            type: "USER_ACCT_CREATE_ERR",
          });
        } else {
          console.log(err)
          res.send({
            error: true,
            reason: err.reason,
            type: "USER_ACCT_CREATE_ERR",
          });
        }
        res.end();
       
      }
});
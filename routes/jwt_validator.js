const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')

const { APP_SECRET_KEY } = process.env;

const jwtValidator = router.use(function(req , res , next) {
        let data = req.header("Authorization");
        if (data) {
            let verified = jwt.verify(data , APP_SECRET_KEY);
            if (!verified){
                req.send({ error: true , message: "Authorization Verification Failed" , type: "API_AUTH_ERR" });
            }else {
                req.user = verified;
                next();
            }
        }else {
            res.send({error: true , message: "Missing Authorization Header" , type: "API_AUTH_MISSING"});
        }
});

module.exports = jwtValidator


const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();

let { APP_SECRET_KEY , MAX_TIMEOUT } = process.env;

 function isEmail(email) {
  var reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
  if (reg.test(email)) {
    return true;
  } else {
    return false;
  }
}

 function isText(text) {
  var reg = /^[A-Za-z]/i;
  if (reg.test(text)) {
    return true;
  } else {
    return false;
  }
}

 function isPassword(pass) {
  try {
    if (
      pass.length >= 8 &&
      /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/.test(pass)
    ) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e.message);
  }
}
 function getMaxServerTimeout() {
  const max_timeout = parseInt(MAX_TIMEOUT);
  return max_timeout;
}






 async function signUser(payload) {
  const signedPayload = jwt.sign(payload, APP_SECRET_KEY);
  return signedPayload;
}

const saltRounds = 10; // Number of salt rounds
 async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
}

async function verifyPassword(plainPassword, hash) {
  const match = await bcrypt.compare(plainPassword, hash);
  return match;
}


module.exports = {
    isPassword ,
    isText,
    isEmail,
    signUser,
    hashPassword,
    verifyPassword
}
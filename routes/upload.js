const express = require('express')
const jwt = require("jsonwebtoken");
const jwtValidator = require('./jwt_validator');
const Files = require('../models/files');
const multer = require('multer'); 

const route = express.Router() 

// Set up multer for file uploads  
const storage = multer.diskStorage({  
    destination: (req, file, cb) => {  
        cb(null, 'uploads'); // Save files to the 'uploads' directory  
    },  
    filename: (req, file, cb) => {  
        cb(null, file.originalname); // Use original file name  
    },  
});  

const upload = multer({ storage }); 


route.use(jwtValidator)
module.exports = route.use(upload.single('file'), async (req, res) => {  
  try { 
    const  { meetingId }  = req.body;
    // console.log("meetingId" , meetingId)
    
    const file = req.file;  
    // io.emit('file-uploaded', { fileName: file.originalname });  
    const {filename , filepath , uploadedBy} = { 
        filename: file.originalname,
        filepath: file.path,
        uploadedBy: req.user._id,
        session: meetingId,
    }
    const _file = new Files({ filename , filepath , uploadedBy, session:meetingId})
    await _file.save();

    res.json({ error: false , reason: "File Uploaded Sucessfully" , fileName: file.originalname }); 
  
} catch(e) { 
    console.log(e)
    if (e.code == 11000) { 
        res.json({error: true , reason: "File already exists on the server.\n Rename file to re-upload.  "})

    }

  }
});  
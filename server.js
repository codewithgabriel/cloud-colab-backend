require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: fetch } = require("node-fetch");
const path = require('path');

//const jwt = require("jsonwebtoken");
const socketIo = require('socket.io');
const http = require('http');




const { connect } = require('mongoose')
connectDb().catch(err => console.log(err));

async function connectDb() {
  await connect('mongodb://127.0.0.1:27017/cloud-app');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const PORT = 9000;
const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads')); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//init socketIo 
const server = http.createServer(app)

const io = socketIo(server , {
  cors: {  
    origin: "*", // You might want to restrict this in a production environment  
    methods: ["GET", "POST"]  
} 
})


//
app.use(express.static(path.join(__dirname, 'dist')));

// app.get("/", (req, res) => {
//   res.send("Server is running...!");
// });


const getToken = require('./routes/get-token')
app.get("/get-token" , getToken);


const createMeeting = require('./routes/create_meeting')
app.post("/create-meeting/" , createMeeting);

//
app.post("/validate-meeting/:meetingId", (req, res) => {
  const token = req.body.token;
  const meetingId = req.params.meetingId;

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/api/meetings/${meetingId}`;

  const options = {
    method: "POST",
    headers: { Authorization: token },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => res.json(result)) // result will contain meetingId
    .catch((error) => console.error("error", error));
});

// login route

const login = require('./routes/login')
app.post('/login' , login)

//signup route 
const signup = require('./routes/signup');
app.post('/signup' , signup)

//upload route
const upload = require("./routes/upload");
app.post('/upload', upload)


//getUser route
const getUser = require("./routes/getUser");
app.post('/getUser', getUser)

//getFiles 
const getFiles = require("./routes/getFiles");

app.post('/getFiles' , getFiles);

//implement socket handling  
const IO_PORT = 9090;
server.listen(IO_PORT, ()=> { 
  console.log(`IO server listening at http://localhost:${IO_PORT}`)
})

const Files = require('./models/files');
const multer = require('multer'); 

const route = express.Router() 

// Set up multer for file uploads  
const storage = multer.diskStorage({  
    destination: (req, file, cb) => {  
        cb(null, 'static/uploads'); // Save files to the 'uploads' directory  
    },  
    filename: (req, file, cb) => {  
        cb(null, file.originalname); // Use original file name  
    },  
}); 


const fs = require('fs');


io.on('connection' , (socket)=> { 
  
  console.log('New user connected.')
  socket.on('sendMessage' , (message)=> { 

    // if (message.buffer) { 
    //   fs.writeFile('uploads', Buffer.from(message.buffer), (err) => {
    //     if (err) {
    //         console.error('File write error:', err);
    //         socket.emit('uploadStatus', 'failure');
    //     } else {
    //         console.log('File uploaded successfully');
    //         socket.emit('uploadStatus', 'success');
    //     }
    // });
    // }
    
    io.emit('receiveMessage' , message )
    //implementing message with file saving 


  })

  socket.on('disconnect', ()=> { 
    console.log('user disconnected')
  })
  
})
app.listen(PORT, () => {
  console.log(`API server listening at http://localhost:${PORT}`);
});



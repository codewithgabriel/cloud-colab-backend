require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: fetch } = require("node-fetch");
const path = require("path");

//const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
const http = require("http");

const { connect } = require("mongoose");

async function connectDb() {
  await connect(process.env.DB_URL);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
connectDb().catch((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database Connected");
  }
});




const PORT = 9000;
const app = express();

app.use(cors());


app.use("dist", express.static("dist"));

app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//init socketIo
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*", // You might want to restrict this in a production environment
    methods: ["GET", "POST"],
  },
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
// app.get("/", (req, res) => {
//   res.send("Server is running...!");
// });

const getToken = require("./routes/get-token");
app.get("/get-token", getToken);

const createMeeting = require("./routes/create_meeting");
app.post("/create-meeting/", createMeeting);

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

const login = require("./routes/login");
app.post("/login", login);

//signup route
const signup = require("./routes/signup");
app.post("/signup", signup);

//upload route
const upload = require("./routes/upload");
app.post("/upload", upload);

//getUser route
const getUser = require("./routes/getUser");
app.post("/getUser", getUser);

//getFiles
const getFiles = require("./routes/getFiles");

app.post("/getFiles", getFiles);

//implement socket handling
const IO_PORT = 9090;
server.listen( IO_PORT, () => {
  console.log(`IO server listening at http://localhost:${IO_PORT}`);
});



io.on("connection", (socket) => {
  console.log("New user connected.");
  socket.on("sendMessage", (message) => {
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

    io.emit("receiveMessage", message);
    //implementing message with file saving
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
app.listen(process.env.PORT || PORT, () => {
  console.log(`API server listening at http://localhost:${PORT}`);
});


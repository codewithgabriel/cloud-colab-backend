require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: fetch } = require("node-fetch");
const path = require("path");
const { connect } = require("mongoose");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server , 
   {
    cors: {
      origin: "*", // Consider restricting this for production
      methods: ["GET", "POST"],
      credentials: true,
    },
   }
);

// Database connection
async function connectDb() {
  await connect(process.env.DB_URL);
}
connectDb().catch((err) => {
  console.log("Database Connection Error:", err);
});

// Express app setup
const PORT = process.env.PORT || 9000;
app.use(cors());
app.use("/dist", express.static("dist"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Express Routes
const getToken = require("./routes/get-token");
app.get("/get-token", getToken);

const createMeeting = require("./routes/create_meeting");
app.post("/create-meeting/", createMeeting);

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
    .then((result) => res.json(result))
    .catch((error) => console.error("Validation Error:", error));
});

// Authentication routes
const login = require("./routes/login");
app.post("/login", login);

const signup = require("./routes/signup");
app.post("/signup", signup);

// File and user routes
const upload = require("./routes/upload");
app.post("/upload", upload);

const getUser = require("./routes/getUser");
app.post("/getUser", getUser);

const getFiles = require("./routes/getFiles");
app.post("/getFiles", getFiles);



// Handle socket connections
io.on("connection", (socket) => {
  console.log("New user connected.");

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


//server listening on port
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
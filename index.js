require('dotenv').config();
var compression = require('compression')
const jwt = require("jsonwebtoken");
const OpenAi = require("./openai-config");
// const translateText = require('./translate');
const googletranslateText = require('./googletranslate');
//new code
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
//new code

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
 app.use(compression())

app.use(cors());
//new code
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5005", // Adjust this to your frontend URL
    // origin: "http://3.111.123.51:5005", // Adjust this to your frontend URL
    methods: ["GET", "POST"]
  }
});
app.use(express.json());
//new code
const connectDB = require('./db'); // Ensure you have the connectDB function in a separate file
// 3) MONGO DB CONNECTION
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}


connectDB(uri);

const { authenticateToken } = require('./middilware/authMiddleware');
const { register, login, logout } = require('./controllers/authController');
const userstranslateController = require('./controllers/userstranslateController');

const authRoute = require("./routes/authRoute");
const mobileauthRoute = require("./routes/mobileauthRoute");
const staticsRoute = require("./routes/staticsRoute");
const v2staticsRoute = require("./routes/v2/staticsRoute");
const v2userRoute = require("./routes/v2/userRoute");
const v2authRoute = require("./routes/v2/mobileauthRoute");
const v2surveyRoute = require("./routes/v2/surveyRoute");
const v2taskRoute = require("./routes/v2/taskRoute");
const v2taskreportRoute = require("./routes/v2/report/taskreportsRoute");

const userRoute = require("./routes/userRoute");
const surveyRoute = require("./routes/surveyRoute");
const general_newsRoute = require("./routes/general_newsRoute");
const v2general_newsRoute = require("./routes/v2/general_newsRoute");
const v2suggestionRoute = require("./routes/v2/suggestionRoute");
const v2familyreportRoute = require("./routes/v2/report/familyreportRoute");
const v2voterreportRoute = require("./routes/v2/report/familyvotersreportRoute");
const v2usersreportRoute = require("./routes/v2/report/usersreportRoute");
const v2dashboardRoute = require("./routes/v2/report/dashboardRoute");
const v2activeuserRoutes = require("./routes/v2/activeuserRoute");
const v2electiondaydataRoutes = require("./routes/v2/electiondaydataRoute");
const ElectiondayController = require('./controllers/v2/reports/ElectiondayController');
const v2managmentdataRoutes = require("./routes/v2/managmentteam/userslistRouter");
const v2selfhelpgroupRoute = require("./routes/v2/selfhelpgroupRoute");
const v2locationRoute = require("./routes/v2/locationRoute");

const v2pracharkRoute = require("./routes/v2/pracharkRoute");
const v2castestaticRoute = require("./routes/v2/castestaticRoute");
// 1) MIDDLEWARE

//new code
app.use(cookieParser());
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/logout', logout);
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

app.post('/translate', async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;

  try {
    const translatedText = await googletranslateText(text, sourceLang, targetLang);
    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: 'Error translating text' });
  }
});

app.post('/translate-openai', OpenAi.translateHindiToEnglish);
app.post('/aws-translate', userstranslateController.users);
app.post('/aws-translate_caste', userstranslateController.casteUpdate);
// app.post('/aws-translate', async (req, res) => {
//   // console.log(req.body)
//   const { translatetext, sourceLang, targetLang } = req.body;
//   try {
//     const translatedText = await translateText(translatetext, sourceLang, targetLang);
//     res.json({ translatedText });
//   } catch (error) {
//     res.status(500).json({ error: 'Error translating translatetext' });
//   }
// });
app.get('/api/active-users', async (req, res) => {
  try {
    const activeUsers = await User.find({ isActive: true });
    res.json(activeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
let activeUsers = {};
let connectedUsers = {};  // Keeps track of users' socket IDs

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.user = user;
    await User.findByIdAndUpdate(user.id, { isActive: true, socketId: socket.id });
    connectedUsers[user.id] = { username: user.id, socketId: socket.id };
    next();
  });
});

io.on('connection', async (socket) => {
  console.log(`User connected: ${JSON.stringify(socket.user, null, 2)}`);
  // Listen for force logout event
  io.emit('newuserConnected', { username: socket.user.username });

  socket.on('forceLogout', async (userId) => {
    // console.log(`Userid ${userId} forced to log out`);
    const user = await User.findOne({ _id: userId });
    if (user && user.socketId) {
      socket.to(user.socketId).emit('logout');
      // console.log(`User ${user.name} forced to log out`);
      // Optionally remove user socketId from MongoDB
      user.socketId = null;
      await user.save();
    }
  });
  // Get all connected users
  socket.on('getUsersList', () => {
    socket.emit('userList', connectedUsers);
  });

 socket.on('updatevote', async (data, callback) => {
    console.log('Data received for updateDta:', data);
    // Ensure callback is a function
    if (typeof callback !== 'function') {
      console.error('Callback is not a function');
      return;
    }
    // Call the updateVoteDetail function from ElectiondayController
    await ElectiondayController.updateVoteDetail(data, (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        callback({
          status: "fail",
          error: err.message,
        });
      } else {
        console.log('Data updated successfully:', result);
        callback({
          status: "ok",
         result: result,
        });
      }
    });
  });
  socket.on('disconnect', async () => {
    // console.log(`User disconnected: ${socket.id}`);
    await User.findByIdAndUpdate(socket.user.id, { isActive: false, socketId: null });
    const activeUsers = await User.find({ isActive: true }).select('username');
    io.emit('userdisconnected');
    io.emit('activeUsers', activeUsers);
  });

  socket.on('logout', async () => {
    // console.log(`User logged out: ${socket.id}`);
    await User.findByIdAndUpdate(socket.user.id, { isActive: false, socketId: null });
    const activeUsers = await User.find({ isActive: true }).select('username');
    io.emit('userdisconnected');

    io.emit('activeUsers', activeUsers);
    socket.disconnect();
  });
});


ElectiondayController.setSocketIoInstance(io);
//new code
// 2) ROUTE
//mobiles apis
app.use("/api/statics", staticsRoute);
app.use("/api/v1/auth", mobileauthRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/survey", surveyRoute);
app.use("/api/v1/general_news", general_newsRoute);

app.use("/api/auth", authRoute);

var exportsRoute = require("./routes/exportdataRoute");
// const { authenticateToken } = require('./middilware/authMiddleware');
const { Socket } = require('socket.io');
const User = require('./models/userModel');
// const { translateHindiToEnglish } = require('./openai-config');
// const connectDB = require("./db");
app.use("/import", exportsRoute);

//v2

app.use("/api/v2/statics", v2staticsRoute);
app.use("/api/v2/auth", v2authRoute);
app.use("/api/v2/user", v2userRoute);
app.use("/api/v2/survey", v2surveyRoute);
app.use("/api/v2/selfhelpgroup", v2selfhelpgroupRoute);
app.use("/api/v2/prachark", v2pracharkRoute);
app.use("/api/v2/castestatic", v2castestaticRoute);

app.use("/api/v2/general_news", v2general_newsRoute); //taskRoute
app.use("/api/v2/task", v2taskRoute); //taskRoute
app.use("/api/v2/suggestion", v2suggestionRoute);
app.use("/api/v2/familyreportRoute", v2familyreportRoute);
app.use("/api/v2/votersreport", v2voterreportRoute);
app.use("/api/v2/userreports", v2usersreportRoute);
app.use("/api/v2/taskreport", v2taskreportRoute);
app.use("/api/v2/dash", v2dashboardRoute);
app.use("/api/v2/activeuser", v2activeuserRoutes);
app.use("/api/v2/electiondaydata", v2electiondaydataRoutes);

app.use("/api/v2/managmentdata", v2managmentdataRoutes);
app.use("/api/v2/location", v2locationRoute);

//router end

app.get("/", authenticateToken, (request, response) => {
  const status = {
    Status: "Running",
    Date: new Date().toString(),
  };

  response.send(status);
});
app.use("/uploads", express.static("./uploads"));

// const uris =
// "mongodb+srv://shivamkumawat555:Shivam8225@cluster0.ux79kv9.mongodb.net/partyapp?retryWrites=true&w=majority&appName=Cluster0";
// const uri = "mongodb://127.0.0.1:27017/authentication";

// mongoose
//   .connect(uri)
//   .then(() => console.log("Connected to MongoDb"))
//   .catch((error) => console.error("Failed to Connect to MongoDb:", error));
// 4) GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Start Socket.IO connection
//io.on('connection', (socket) => {
  // console.log(`User connected: ${socket.id}`);

//  socket.on('disconnect', () => {
    // console.log(`User disconnected: ${socket.id}`);
  //});
//});
// 5) SERVER
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`App running on : ${PORT}`);
// });


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`App running on : ${PORT}`);
});

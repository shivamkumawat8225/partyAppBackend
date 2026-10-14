const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoute = require("./routes/authRoute");
const mobileauthRoute = require("./routes/mobileauthRoute");
const staticsRoute = require("./routes/staticsRoute");
const userRoute = require("./routes/userRoute");
const surveyRoute = require("./routes/surveyRoute");

// 1) MIDDLEWARE
app.use(cors());
app.use(express.json());

// 2) ROUTE
//mobiles apis
app.use("/api/v1/auth", mobileauthRoute);
app.use("/api/v1/survey", surveyRoute);

app.use("/api/v1/user", userRoute);

app.use("/api/auth", authRoute);

var exportsRoute = require("./routes/exportdataRoute");
app.use("/import", exportsRoute);

app.use("/api/statics", staticsRoute);
app.get("/", (request, response) => {
  const status = {
    Status: "Running",
    Date: new Date().toString(),
  };

  response.send(status);
});
app.use("/uploads", express.static("./uploads"));

const uri =
  "mongodb+srv://shivamkumawat555:Shivam8225@cluster0.ux79kv9.mongodb.net/partyapp?retryWrites=true&w=majority&appName=Cluster0";
// const uri = "mongodb://127.0.0.1:27017/authentication";
// 3) MONGO DB CONNECTION
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDb"))
  .catch((error) => console.error("Failed to Connect to MongoDb:", error));
// 4) GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// 5) SERVER
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`App running on : ${PORT}`);
});

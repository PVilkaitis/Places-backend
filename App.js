const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpRoutes = require("./models/http-error");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); // converts posted data to json format for routes func

app.use((req, res, next) => {
  // for solving CORS error, between diff servers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes); // only => /api/places/... routes
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  //if no matching routes found
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error); //if error response allready sent
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured." });
});

mongoose
  .connect(
    "mongodb+srv://Krupnikas:Ee8syYX9NtS2py6q@cluster0.0zrhz.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

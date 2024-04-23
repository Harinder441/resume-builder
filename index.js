// File: app.js

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const routes = require("./routes");
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");
const { errorHandler } = require("./middlewares/error");
const config = require("./config/config");
const cors = require('cors');

app.use(cors());
app.use(express.json());

const port = 8082;

app.use("/", routes);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});
app.use(errorHandler);

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Nodejs server started on port ${port}`);
    });
  });

// File: app.js

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const notionService  = require('./services/notion.service')
const syncMappingRoutes = require('./routes/sync.route');
const notionRoutes = require('./routes/notion.route');
app.use(express.json());

const port = 8082;

app.get("/", (req, res) => {
  res.send("Hello");
});

// app.use('/discussion', discussionRoutes);
mongoose
  .connect("mongodb://127.0.0.1:27017", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Nodejs server started on port ${port}`);
    });
  });

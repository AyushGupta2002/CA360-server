//jshint esversion:6
const {mongoURL} = require("./constant.js");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use('/public/uploads/', express.static("public/uploads"));

mongoose.connect(mongoURL, {
  useNewUrlParser: true
});

const Client =  require('./src/models/client');
const User = require('./src/models/user');
const Task = require('./src/models/task');
const Role = require('./src/models/role');

const userRoute = require("./src/controllers/user");
const clientRoute = require("./src/controllers/client");
const loginRoute = require("./src/controllers/auth");
const taskRoute = require("./src/controllers/task");
const enumRoute = require("./src/controllers/enums");
const roleRoute = require("./src/controllers/role");
const uploadFilesRoute = require("./src/controllers/uploadFiles");

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
};
const cors = require("cors");
app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use("/api/client", clientRoute);
app.use("/api/auth", loginRoute);
app.use("/api/task", taskRoute);
app.use("/api/enums", enumRoute);
app.use("/api/role", roleRoute);
app.use("/api/task", uploadFilesRoute);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`App is running on port ${ PORT }`);
});

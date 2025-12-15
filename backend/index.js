const express = require('express');
const { mongoose } = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const path=require("path");
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allow all methods
  allowedHeaders: ["*"],  // Allow all headers
}));

// app.use(cors());
const router = require("./routes/otp.js");
const store=require("./routes/index.js");
const amount=require("./routes/storeamount.js")
const fetchAll = require('./routes/fetchall');
const Activ=require("./routes/activity")
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { connectMongo } = require('./connection/index.js');
app.use(express.urlencoded());
app.use(express.json());
app.use('/api', router);
app.use('/api',store);
app.use('/api',amount);
app.use('/api', fetchAll);
app.use("/api",Activ)
connectMongo(process.env.mongodb_url)
  .then(() => console.log('mongodb connected'))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

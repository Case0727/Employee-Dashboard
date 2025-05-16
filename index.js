const express = require("express");
const app = express();
const cors = require("cors");
const port = 7000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const db = require("./config/db");
const session = require("express-session");
const route = require("./routes/routes")
const controllers =  require("./controllers/authcontrollers")


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/', route)
app.use(express.static(path.join(__dirname, 'public')));


// Session
app.set("view engine", "ejs")


// Connect to Server
db.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});

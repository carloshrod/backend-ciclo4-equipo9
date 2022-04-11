const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { userRutas } = require('./rutas/userRutas');
const { predioRutas } = require('./rutas/predioRutas');
require("dotenv").config();
const path = require("path");

//Middlewares:
app.use(cors()); //Middleware cors
app.use(express.json()); //Middleware json()
app.use(express.urlencoded({ extended: false }));

// APIs:
app.use("/users", userRutas);
app.use("/predios", predioRutas);
app.use(express.static(path.join(__dirname,"/storage/imgs")))

// Connection to database:
mongoose.connect(process.env.SERVER_DB_URL)
    .then(() => console.log("Connected to database!!!"))
    .catch((error) => {
        console.log("Connection failed!!!");
        console.log(error);
    });

app.listen(process.env.PORT, function () {
    console.log(`Server listening on port ${process.env.PORT}...`);
})

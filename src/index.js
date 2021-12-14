const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const { userRutas } = require('./rutas/userRutas');
const { predioRutas } = require('./rutas/predioRutas');

app.use(cors()); //Middleware cors
app.use(express.json()); //Middleware json()


// API Listar usuarios:
app.use("/users",userRutas);

// API Listar predios:
app.use("/predios", predioRutas);

mongoose.connect("mongodb://127.0.0.1:27017/DBCatastral")
    .then(res => console.log("Conectado a BD"))
    .catch(error => console.log(error));


app.listen(8080, function() {
    console.log("Server listening on port 8080...");
})

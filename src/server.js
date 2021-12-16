const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { userRutas } = require('./rutas/userRutas');
const { predioRutas } = require('./rutas/predioRutas');

app.use(cors()); //Middleware cors
app.use(express.json()); //Middleware json()

// APIs:
app.use("/users",userRutas);
app.use("/predios", predioRutas);

mongoose.connect("mongodb+srv://userCatastral:98765@cluster0.p4sed.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(res => console.log("Conectado a BD"))
    .catch(error => console.log(error));


app.listen(8080, function() {
    console.log("Server listening on port 8080...");
})

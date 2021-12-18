const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { userRutas } = require('./rutas/userRutas');
const { predioRutas } = require('./rutas/predioRutas');
require("dotenv").config();

app.use(cors()); //Middleware cors
app.use(express.json()); //Middleware json()

// APIs:
app.use("/users",userRutas);
app.use("/predios", predioRutas);

mongoose.connect(process.env.SERVER_DB_URL)
    .then(() => console.log("Conectado a BD"))
    .catch((error) => {
        console.log("Falló la conexión a la base de datos");
        console.log(error);
    });


app.listen(8080, function() {
    console.log("Server listening on port 8080...");
})

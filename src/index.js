const express = require('express');
const cors = require("cors");
const app = express();
const { users, predios } = require('./db');

app.use(cors()); //Middleware cors
app.use(express.json()); //Middleware json()

// app.get("/", function(req, res) {
//     res.send("Hola mundo!!!");
// })

// API Listar usuarios:
app.get("/users", function(req, res) {
    res.send(users);
})

// API Listar predios:
app.get("/predios", function(req, res) {
    res.send(predios);
})

app.listen(8080, function() {
    console.log("Server listening on port 8080...");
})

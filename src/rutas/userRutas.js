const {Router}= require('express');
const userRutas = Router();
const {userModel} = require('../modelos/userModel');

userRutas.get("/listar", function(req, res) {
    // Busca el producto en la BD
    userModel.find({ }, function (error, user) {
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Producto NO encontrado" })
            return false;
        } else {
            if (user !== null) {
                res.send({ estado: "ok", msg: "Usuarios Visualizados", data: user })
            } else {
                res.send({ estado: "error", msg: "Producto NO encontrado" })
            }
        }
    })
});

userRutas.post("/guardar", function (req, res) {
    const data = req.body;
    console.log(data)
    const user = new userModel(data);
    user.save(function (error) {
        console.log(error)
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Usuario NO guardado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Guardado satisfactoriamente" })
    })
});





exports.userRutas = userRutas;
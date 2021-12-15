const { Router } = require('express');
const userRutas = Router();
const { userModel } = require('../modelos/userModel');

userRutas.get("/listar", function (req, res) {
    // Busca el producto en la BD
    userModel.find({}, function (error, user) {
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
    const user = new userModel(data);
    user.save(function (error) {
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Usuario NO guardado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Guardado satisfactoriamente", data: user })
    })
});

userRutas.put("/editar", function (req, res) {
    let data = req.body;
    const user = new userModel(data);
    user.updateOne({
        $set: req.body
    }, function (error) {
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Usuario NO actualizado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Actualizado satisfactoriamente" })
    })
});

userRutas.post("/eliminar", function (req, res) {
    //Capturar los datos que vienen del cliente
    const id = req.body.id;
    //Buscar por nombre de producto en 'BD'
    let i = 0;
    for (const u of usuarios) {
        if (u.id == id) {
            usuarios.splice(i, 1) //Elimina el producto
            break;
        }
        i++;
    }
    //Responder al cliente
    res.send({ estado: "ok", msg: "Producto Eliminado!" });
})

exports.userRutas = userRutas;
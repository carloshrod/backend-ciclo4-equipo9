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

userRutas.delete("/eliminar/:id", function (req, res) {
    //Capturar los datos que vienen del cliente
    const i = req.params.id;
    //Buscar por nombre de producto en 'BD'
    userModel.findOneAndDelete({id:i},(error,resp)=>{
        if(error){
            res.send({ estado: "error", msg: "ERROR: Usuario NO eliminado" })
        }
        res.send({ estado: "ok", msg: "Eliminado satisfactoriamente" })
    })
})

exports.userRutas = userRutas;
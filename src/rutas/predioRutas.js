const {Router}= require('express');
const predioRutas = Router();
const {predioModel} = require('../modelos/predioModel');

predioRutas.get("/listar", function(req, res) {
    // Busca el producto en la BD
    predioModel.find({ }, function (error, pred) {
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Predios NO encontrado" })
            return false;
        } else {
            if (pred !== null) {
                res.send({ estado: "ok", msg: "Predios Visualizados", data: pred })
            } else {
                res.send({ estado: "error", msg: "Predios NO encontrado" })
            }
        }
    })
})

predioRutas.post("/guardar", function (req, res) {
    const data = req.body;
    console.log(data)
    const predio = new predioModel(data);
    predio.save(function (error) {
        console.log(error)
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Usuario NO guardado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Guardado satisfactoriamente" })
    })
});



exports.predioRutas = predioRutas;
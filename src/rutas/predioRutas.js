const { Router } = require('express');
const predioRutas = Router();
const { predioModel } = require('../modelos/predioModel');

predioRutas.get("/listar", function (req, res) {
    // Busca el producto en la BD
    predioModel.find({}, function (error, predio) {
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Predios NO encontrado" })
            return false;
        } else {
            if (predio !== null) {
                res.send({ estado: "ok", msg: "Predios Visualizados", data: predio })
            } else {
                res.send({ estado: "error", msg: "Predios NO encontrado" })
            }
        }
    })
})

predioRutas.post("/guardar", function (req, res) {
    const data = req.body;
    const predio = new predioModel(data);
    console.log(data);
    predio.save(function (error) {
        if (error) {
            console.log(res.error);
            res.send({ estado: "error", msg: "ERROR: Predio NO guardado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Guardado satisfactoriamente", data: predio })
    })
});

predioRutas.put("/editar", function (req, res) {
    const data = req.body;
    const predio = new predioModel(data);
    predio.updateOne({
        $set: req.body
    }, function (error) {
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Usuario NO actualizado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Actualizado satisfactoriamente"})
    })
});

predioRutas.delete("/eliminar/:codigo", function (req, res) {
    //Capturar los datos que vienen del cliente
    const i = req.params.codigo;
    //Buscar por nombre de producto en 'BD'
    predioModel.findOneAndDelete({codigo:i},(error,resp)=>{
        if(error){
            res.send({ estado: "error", msg: "ERROR: Predio NO eliminado" })
        }
        res.send({ estado: "ok", msg: "Eliminado satisfactoriamente" })
    })
})

predioRutas.get("/consultar/:doc", function (req, res) {
    const i = req.params.doc;
    // Busca el producto en la BD
    predioModel.find({doc_prop:i,asociado:1}, function (error, predio) {
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Predios NO encontrado" })
            return false;
        } else {
            if (predio !== null) {
                res.send({ estado: "ok", msg: "Predios Visualizados", data: predio })
            } else {
                res.send({ estado: "error", msg: "Predios NO encontrado" })
            }
        }
    })
})

predioRutas.get("/asociar/:predio", function (req, res) {
    const i = req.params.predio;
    // Busca el producto en la BD
    predioModel.updateOne({codigo:i},{asociado:0}, function (error, predio) {
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Predios NO Asociado" })
            return false;
        } else {
            if (predio !== null) {
                res.send({ estado: "ok", msg: "Predios Asociado correctamente"})
            } else {
                res.send({ estado: "error", msg: "Predios NO encontrado" })
            }
        }
    })
})



exports.predioRutas = predioRutas;
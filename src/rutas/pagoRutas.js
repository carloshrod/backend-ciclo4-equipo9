const { Router } = require('express');
const pagoRutas = Router();
const { pagoModel } = require('../modelos/pagoModel');

pagoRutas.get("/listar", function (req, res) {
    // Busca el producto en la BD
    pagoModel.find({}, function (error, pago) {
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Producto NO encontrado" })
            return false;
        } else {
            if (pago !== null) {
                res.send({ estado: "ok", msg: "Pagos Visualizados", data: pago })
            } else {
                res.send({ estado: "error", msg: "Pagos NO encontrado" })
            }
        }
    })
});

/* pagoRutas.post("/guardar", function (req, res) {
    const data = req.body;
    const pago = new pagoModel(data);
    pago.save(function (error) {
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Usuario NO guardado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Guardado satisfactoriamente", data: pago })
    })
}); */

pagoRutas.put("/editar", function (req, res) {
    let data = req.body;
    const pago = new pagoModel(data);
    pagoModel.findByIdAndUpdate({
        $set: req.body
    }, function (error) {
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Pagos NO actualizado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Pagos satisfactoriamente" })
    })
});


exports.pagoRutas = pagoRutas;
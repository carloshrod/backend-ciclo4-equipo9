const { Router } = require('express');
const { authPrediosMid } = require('../middlewares/authPrediosMid');
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

predioRutas.post("/guardar", authPrediosMid, function (req, res) {
    const data = req.body;
    const predio = new predioModel(data);
    console.log(data);
    predio.save(function (error) {
        if (error) {
            console.log(res.error);
            return res.send({ estado: "error", msg: "ERROR: El predio no pudo ser creado!!!" });
        }
        return res.status(200).send({ estado: "ok", msg: "El predio fue creado exitosamente!!!", data: predio })
    })
});

predioRutas.post("/editar", authPrediosMid, function (req, res) {
    const data = req.body;
    const predio = new predioModel(data);
    predio.updateOne({
        $set: req.body
    }, function (error) {
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El predio no pudo ser editado!!!" });
        }
        return res.status(200).send({ estado: "ok", msg: "El predio fue editado exitosamente!!!", data: predio})
    })
});

predioRutas.delete("/eliminar/:codigo", authPrediosMid, function (req, res) {
    //Capturar los datos que vienen del cliente
    const i = req.params.codigo;
    //Buscar por nombre de producto en 'BD'
    predioModel.findOneAndDelete({codigo:i},(error,resp)=>{
        if(error){
            return res.send({ estado: "error", msg: "ERROR: El predio no pudo ser eliminado!!!" })
        }
        return res.status(200).send({ estado: "ok", msg: "El predio fue eliminado exitosamente!!!" })
    })
})

predioRutas.get("/consultar/:doc_prop", function (req, res) {
    // Captura el codigo del predio a buscar
    const i = req.params.doc_prop;
    console.log(i)
    // Busca el producto en la BD
    predioModel.find({ doc_prop: i }, (error, predio) => {
        console.log(error)
        console.log(predio)
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Predio NO encontrado" })
            return false;
        } else {
            if (predio !== null) {
                res.send({ estado: "ok", msg: "Predio Encontrado", data: predio })
            } else {
                res.send({ estado: "error", msg: "Predio NO encontrado" })
            }
        }
    })
});
predioRutas.get("/consultarP/:codigo", function (req, res) {
    // Captura el codigo del predio a buscar
    const i = req.params.codigo;
    console.log(i)
    // Busca el producto en la BD
    predioModel.findOne({ codigo: i }, (error, predio) => {
        console.log(error)
        console.log(predio)
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Predio NO encontrado" })
            return false;
        } else {
            if (predio !== null) {
                res.send({ estado: "ok", msg: "Predio Encontrado", data: predio })
            } else {
                res.send({ estado: "error", msg: "Predio NO encontrado" })
            }
        }
    })
});

// predioRutas.get("/consultar/:doc", function (req, res) {
//     const i = req.params.doc;
//     // Busca el producto en la BD
//     predioModel.find({doc_prop:i,asociado:1}, function (error, predio) {
//         // Si hubo error
//         if (error) {
//             res.send({ estado: "error", msg: "Predios NO encontrado" })
//             return false;
//         } else {
//             if (predio !== null) {
//                 res.send({ estado: "ok", msg: "Predios Visualizados", data: predio })
//             } else {
//                 res.send({ estado: "error", msg: "Predios NO encontrado" })
//             }
//         }
//     })
// })

// predioRutas.get("/asociar/:predio", function (req, res) {
//     const i = req.params.predio;
//     // Busca el producto en la BD
//     predioModel.updateOne({codigo:i},{asociado:0}, function (error, predio) {
//         // Si hubo error
//         if (error) {
//             res.send({ estado: "error", msg: "Predios NO Asociado" })
//             return false;
//         } else {
//             if (predio !== null) {
//                 res.send({ estado: "ok", msg: "Predios Asociado correctamente"})
//             } else {
//                 res.send({ estado: "error", msg: "Predios NO encontrado" })
//             }
//         }
//     })
// })



exports.predioRutas = predioRutas;
const { Router } = require('express');
const { authPrediosMid } = require('../middlewares/authPrediosMid');
const predioRutas = Router();
const { predioModel } = require('../modelos/predioModel');
const { userModel } = require('../modelos/userModel');
const { verify } = require("jsonwebtoken");

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
    const token = req.headers.authorization.split(' ')[1];
    const payload = verify(token, process.env.JWT_SECRET_KEY);
    predio.save((error) => {
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El predio no pudo ser creado!!!" });
        } else {
            userModel.findOne({ nro_doc: payload.nro_doc })
                .then((user) => {
                    user.created_predios += 1
                    user.updateOne({
                        $set: {
                            created_predios: user.created_predios
                        }
                    }, (error) => {
                        if (error) {
                            console.log(error)
                        }
                        return res.status(200).send({ estado: "ok", msg: "El predio fue creado exitosamente!!!", data1: predio, data2: user })
                    })
                })
        }
    })
});

predioRutas.post("/editar", authPrediosMid, function (req, res) {
    const data = req.body;
    const predio = new predioModel(data);
    const token = req.headers.authorization.split(' ')[1];
    const payload = verify(token, process.env.JWT_SECRET_KEY);
    predio.updateOne({
        $set: req.body
    }, (error) => {
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El predio no pudo ser editado!!!" });
        } else {
            userModel.findOne({ nro_doc: payload.nro_doc })
                .then((user) => {
                    user.edited_predios += 1
                    user.updateOne({
                        $set: {
                            edited_predios: user.edited_predios
                        }
                    }, (error) => {
                        if (error) {
                            console.log(error)
                        }
                        return res.status(200).send({ estado: "ok", msg: "El predio fue editado exitosamente!!!", data: user })
                    })
                })
        }
    })
});

predioRutas.post("/eliminar/:codigo", authPrediosMid, function (req, res) {
    const i = req.params.codigo;
    const token = req.headers.authorization.split(' ')[1];
    const payload = verify(token, process.env.JWT_SECRET_KEY);
    predioModel.findOneAndDelete({ codigo: i }, (error) => {
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El predio no pudo ser eliminado!!!" })
        } else {
            userModel.findOne({ nro_doc: payload.nro_doc })
                .then((user) => {
                    user.deleted_predios += 1
                    user.updateOne({
                        $set: {
                            deleted_predios: user.deleted_predios
                        }
                    }, (error) => {
                        if (error) {
                            console.log(error)
                        }
                        return res.status(200).send({ estado: "ok", msg: "El predio fue eliminado exitosamente!!!", data: user })
                    })
                })
        }
    })
})


predioRutas.get("/consultar/:doc_prop", function (req, res) {
    // Captura el codigo del predio a buscar
    const i = req.params.doc_prop;
    // Busca el producto en la BD
    predioModel.find({ doc_prop: i }, (error, predio) => {
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

predioRutas.get("/consultar-uno/:codigo", function (req, res) {
    // Captura el codigo del predio a buscar
    const i = req.params.codigo;
    // Busca el producto en la BD
    predioModel.findOne({ codigo: i }, (error, predio) => {
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
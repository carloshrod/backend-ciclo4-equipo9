const { Router } = require('express');
const { authPrediosMid } = require('../middlewares/authPrediosMid');
const predioRutas = Router();
const { predioModel } = require('../modelos/predioModel');
const { userModel } = require('../modelos/userModel');
const { historialModel } = require('../modelos/historialModel');
const { verify } = require("jsonwebtoken");
const { transporter } = require('../tools/mailer');
const { newPredioOptions } = require('../tools/emailOptions');

// Listar predios:
predioRutas.get("/listar", function (req, res) {
    predioModel.find({ estado: 1 }, function (error, predio) {
        if (error) {
            console.log("Error listando predios: " + error)
            return res.send({ estado: "error", msg: "Predios NO encontrado" })
        } else {
            if (predio !== null) {
                return res.status(200).send({ estado: "ok", msg: "Predios Visualizados", data: predio })
            } else {
                return res.send({ estado: "error", msg: "Predios NO encontrado" })
            }
        }
    })
})

// Listar historial de predios:
predioRutas.get("/historial", function (req, res) {
    historialModel.find({}, function (error, historial) {
        if (error) {
            console.log("Error listando historial: " + error)
            return false
        } else {
            if (historial !== null) {
                return res.send({ estado: "ok", msg: "Predios Visualizados", data: historial })
            } else {
                return res.send({ estado: "error", msg: "Predios NO encontrado" })
            }
        }
    })
})

// Guardar predios:
predioRutas.post("/guardar", authPrediosMid, function (req, res) {
    const data = req.body;
    console.log(req.body)
    const { email_prop, nom_prop, codigo, doc_prop } = req.body
    const predio = new predioModel(data)
    const token = req.headers.authorization.split(' ')[1]
    const payload = verify(token, process.env.JWT_SECRET_KEY)
    predio.save((error) => {
        if (error) {
            console.log("Error creando predio: " + error)
            return res.send({ estado: "error", msg: "ERROR: El predio no pudo ser creado!!!" })
        }
        try {
            transporter.sendMail(newPredioOptions(email_prop, nom_prop, codigo, doc_prop))
        } catch (error) {
            console.log("Error enviando email: " + error)
        }
        userModel.findOne({ nro_doc: payload.nro_doc })
            .then((user) => {
                const historial = new historialModel()
                historial.author = user.nombres
                historial.action = "creó"
                historial.fecha = Date.now()
                historial.code = data.codigo
                historial.save((error) => {
                    if (error) {
                        console.log("Error guardando historial: " + error)
                    }
                })
                user.created_predios += 1
                user.updateOne({
                    $set: {
                        created_predios: user.created_predios
                    }
                }, (error) => {
                    if (error) {
                        console.log("Error actualizando created_predios: " + error)
                    }
                    return res.status(200).send({ estado: "ok", msg: "El predio fue creado exitosamente!!!", data1: predio, data2: user, data3: historial })
                })
            })
    })
});

// Editar predios:
predioRutas.post("/editar", authPrediosMid, function (req, res) {
    const data = req.body;
    const predio = new predioModel(data);
    const token = req.headers.authorization.split(' ')[1]
    const payload = verify(token, process.env.JWT_SECRET_KEY)
    predio.updateOne({
        $set: req.body
    }, (error) => {
        if (error) {
            console.log("Error editando predio: " + error)
            return res.send({ estado: "error", msg: "ERROR: El predio no pudo ser editado!!!" });
        } else {
            userModel.findOne({ nro_doc: payload.nro_doc })
                .then((user) => {
                    const historial = new historialModel()
                    historial.author = user.nombres
                    historial.action = "editó"
                    historial.fecha = Date.now()
                    historial.code = data.codigo
                    historial.save((error) => {
                        if (error) {
                            console.log("Error guardando historial: " + error)
                        }
                    })
                    user.edited_predios += 1
                    user.updateOne({
                        $set: {
                            edited_predios: user.edited_predios
                        }
                    }, (error) => {
                        if (error) {
                            console.log("Error actualizando edited_predios: " + error)
                        }
                        return res.status(200).send({ estado: "ok", msg: "El predio fue editado exitosamente!!!", data1: user, data2: historial })
                    })
                })
        }
    })
});

// Eliminar predios:
predioRutas.post("/eliminar/:codigo", authPrediosMid, function (req, res) {
    const codigo = req.params.codigo;
    const token = req.headers.authorization.split(' ')[1]
    const payload = verify(token, process.env.JWT_SECRET_KEY)
    predioModel.findOne({ codigo }).then((predio) => {
        predio.estado = null
        predio.updateOne({
            $set: {
                estado: predio.estado
            }
        }, (error) => {
            if (error) {
                console.log("Error eliminando predio: " + error)
                return res.send({ estado: "error", msg: "ERROR: El predio no pudo ser eliminado!!!" })
            } else {
                userModel.findOne({ nro_doc: payload.nro_doc })
                    .then((user) => {
                        const historial = new historialModel()
                        historial.author = user.nombres
                        historial.action = "eliminó"
                        historial.fecha = Date.now()
                        historial.code = codigo
                        historial.save((error) => {
                            if (error) {
                                console.log("Error guardando historial: " + error)
                            }
                        })
                        user.deleted_predios += 1
                        user.updateOne({
                            $set: {
                                deleted_predios: user.deleted_predios
                            }
                        }, (error) => {
                            if (error) {
                                console.log("Error actualizando deleted_predios: " + error)
                            }
                            return res.status(200).send({ estado: "ok", msg: "El predio fue eliminado exitosamente!!!", data1: user, data2: historial })
                        })
                    })
            }
        })
    })
})

// Consultar predios por Documento del Propietario:
predioRutas.get("/consultar/:doc_prop", function (req, res) {
    const i = req.params.doc_prop;
    predioModel.find({ doc_prop: i }, (error, predio) => {
        // Si hubo error
        if (error) {
            console.log("Error consultando predios: " + error)
            return res.send({ estado: "error", msg: "Predios NO encontrados", data: [] })
        } else {
            if (predio !== null) {
                return res.send({ estado: "ok", msg: "Predios Encontrados", data: predio })
            } else {
                return res.send({ estado: "error", msg: "Predios NO encontrados" })
            }
        }
    })
});

// Consultar predio pór Código del Predio:
predioRutas.get("/consultar-uno/:codigo", function (req, res) {
    const i = req.params.codigo;
    predioModel.findOne({ codigo: i }, (error, predio) => {
        // Si hubo error
        if (error) {
            console.log("Error consultando predio: " + error)
            return res.send({ estado: "error", msg: "Predio NO encontrado" })
        } else {
            if (predio !== null) {
                return res.send({ estado: "ok", msg: "Predio Encontrado", data: predio })
            } else {
                return res.send({ estado: "error", msg: "Predio NO encontrado", data: {} })
            }
        }
    })
});

exports.predioRutas = predioRutas;
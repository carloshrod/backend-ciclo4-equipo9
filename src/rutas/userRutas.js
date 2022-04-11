const { Router } = require('express');
const userRutas = Router();
const { userModel } = require('../modelos/userModel');
const { compare } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');
const { authMid } = require('../middlewares/authMid');
const upload = require('../middlewares/storage');
const { transporter } = require('../tools/mailer');
const { newUserOptions, resetPasswordOptions } = require('../tools/emailOptions');
const { deleteFile } = require('../tools/deleteFile')
const crypto = require('crypto');

// Iniciar sesión:
userRutas.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.send({ estado: "error", msg: "Credenciales NO válidas. Intentelo de nuevo!!!" });
        }
        const passOK = await compare(password, user.password);
        if (passOK) {
            const token = sign(
                {
                    nro_doc: user.nro_doc,
                    usuario: user.email,
                    rol: user.rol,
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '6h' }
            )
            if (user.rol === 3) {
                return res.status(200).send({ estado: "ok", msg: "Logueado con éxito!!!", token, url: "/user-ext-home" });
            } else if (user.rol === 2) {
                return res.status(200).send({ estado: "ok", msg: "Logueado con éxito!!!", token, url: "/user-int/dashboard" });
            } else if (user.rol === 1) {
                return res.status(200).send({ estado: "ok", msg: "Logueado con éxito!!!", token, url: "/admin/dashboard" });
            }
        } else {
            return res.send({ estado: "error", msg: "Credenciales NO válidas. Intentelo de nuevo!!!" });
        }
    } catch (error) {
        return res.send({ estado: "error", msg: "Credenciales NO válidas. Intentelo de nuevo!!!" });
    }
})

// Listar usuarios:
userRutas.get("/listar", function (req, res) {
    userModel.find({ estado: 1 }, function (error, user) {
        if (error) {
            console.log("Error listando usuarios: " + error)
            return res.send({ estado: "error", msg: "Usuarios NO encontrados" })
        } else {
            if (user !== null) {
                return res.status(200).send({ estado: "ok", msg: "Usuarios Visualizados", data: user })
            } else {
                return res.send({ estado: "error", msg: "Usuarios NO encontrados" })
            }
        }
    })
});

// Guardar usuarios:
userRutas.post("/guardar", upload.single("avatar"), authMid, async function (req, res) {
    const data = req.body;
    const { email, nombres, password } = req.body;
    const user = await new userModel(data);
    if (req.file) {
        const { filename } = req.file
        user.setImgUrl(filename)
    }
    await user.save((error) => {
        console.log("Error creando usuario: " + error)
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El usuario no pudo ser creado!!!" });
        }
        try {
            transporter.sendMail(newUserOptions(email, nombres, password))
            return res.status(200).send({ estado: "ok", msg: "El usuario fue creado exitosamente!!!", user: user })
        } catch (error) {
            return res.send({ estado: "error", msg: "ERROR: Ingrese un correo válido!!!" });
        }
    })
});

// Guardar usuarios externos:
userRutas.post("/registro", async function (req, res) {
    const data = req.body;
    const user = await new userModel(data);
    await user.save((error) => {
        console.log("Error creando usuario externo: " + error)
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: Su cuenta no pudo ser creada. Intentelo más tarde!!!" });
        }
        return res.status(200).send({ estado: "ok", msg: "Su cuenta fue creada exitosamente!!!", data: user })
    })
});

// Editar usuarios:
userRutas.post("/editar", upload.single("avatar"), async function (req, res) {
    const data = req.body;
    const user = await new userModel(data);
    await userModel.findOne({ nro_doc: data.nro_doc }).then((foundUser) => {
        // Editar imágen de perfil:
        if (req.file) {
            if (foundUser.imgUrl) {
                deleteFile(foundUser.imgUrl)
            }
            const { filename } = req.file
            user.setImgUrl(filename)
            data.imgUrl = user.imgUrl
        } else {
            // Borrar imágen de perfil:
            if (data.imgUrl === "borrar") {
                if (foundUser.imgUrl) {
                    deleteFile(foundUser.imgUrl)
                }
                data.imgUrl = ""
            } else {
                data.imgUrl = foundUser.imgUrl
            }
        }
        userModel.updateOne({ nro_doc: data.nro_doc }, {
            $set: data
        }, (error) => {
            console.log("Error editando usuario: " + error)
            if (error) {
                return res.send({ estado: "error", msg: "ERROR: El usuario no pudo ser editado!!!" });
            } else {
                userModel.findOne({ nro_doc: data.nro_doc }).then((user) => {
                    return res.status(200).send({ estado: "ok", msg: "El usuario fue editado exitosamente!!!", user: user })
                })
            }
        })
    })
});

// Eliminar usuarios:
userRutas.delete("/eliminar/:nro_doc", authMid, async function (req, res) {
    const nro_doc = req.params.nro_doc;
    await userModel.findOne({ nro_doc }).then((user) => {
        user.estado = null
        user.updateOne({
            $set: {
                estado: user.estado
            }
        }, (error) => {
            console.log("Error eliminando usuario: " + error)
            if (error) {
                return res.send({ estado: "error", msg: "ERROR: El usuario no pudo ser eliminado!!!" })
            }
            return res.status(200).send({ estado: "ok", msg: "El usuario fue eliminado exitosamente!!!" })
        })
    })
})

// Cambiar contraseña:
userRutas.post("/cambiar-password", async function (req, res) {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const payload = verify(token, process.env.JWT_SECRET_KEY);
    await userModel.findOne({ nro_doc: payload.nro_doc })
        .then(user => {
            compare(currentPassword, user.password)
                .then(passOK => {
                    if (passOK) {
                        compare(newPassword, user.password).then(newPassOK => {
                            if (!newPassOK) {
                                user.password = newPassword
                                user.save().then((savedUser) => {
                                    res.status(200).send({ estado: "ok", msg: "Contraseña actualizada con éxito. Por favor, inicie sesión nuevamente!!!" })
                                }).catch(error => {
                                    console.log("Error cambiando contraseña: " + error)
                                    res.send({ estado: "error", msg: "ERROR: No se pudo actualizar la contraseña!!!" });
                                })
                            } else {
                                return res.send({ estado: "error", msg: "ERROR: Por favor ingrese una contraseña que no haya utilizado antes!!!" })
                            }
                        })
                    } else {
                        return res.send({ estado: "error", msg: "ERROR: Ingrese correctamente su contraseña actual!!!" });
                    }
                })
        })
});

// Solicitar one-time-link para restablecer contraseña:
userRutas.post("/reset-password", async function (req, res) {
    const { email } = req.body;
    await userModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.send({ estado: "error", msg: "Por favor, revise que el correo ingresado sea el mismo con el que se registró!!!" })
            }
            crypto.randomBytes(32, (error, buffer) => {
                if (error) {
                    console.log("Error generando token: " + error)
                }
                const token = buffer.toString("hex")
                user.reset_token = token
                user.expire_token = Date.now() + 3600000
                user.save().then((savedUser) => {
                    const toEmail = savedUser.email
                    const name = savedUser.nombres
                    const resetToken = savedUser.reset_token
                    try {
                        transporter.sendMail(resetPasswordOptions(toEmail, name, resetToken))
                    } catch (error) {
                        console.log("Error enviando email: " + error)
                    }                  
                })
                return res.status(200).json({ estado: "ok", msg: "Por favor, revise su correo!!!" })
            })
        })
})

// Configurar nueva contraseña por medio del one-time-link:
userRutas.post("/new-password", async function (req, res) {
    const { newPassword, sentToken } = req.body
    await userModel.findOne({ reset_token: sentToken, expire_token: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.json({ msg: "El link que está utilizando para restablecer su contraseña caducó. Por favor, solicite uno nuevo!!!" })
            }
            user.password = newPassword
            user.reset_token = undefined
            user.expire_token = undefined
            user.save().then((savedUser) => {
                res.status(200).send({ estado: "ok", msg: "Contraseña restablecida con éxito!!!" })
            }).catch(error => {
                console.log("Error restableciendo contraseña: " + error)
                res.send({ estado: "error", msg: "ERROR: No se pudo actualizar la contraseña" });
            })
        })
});

exports.userRutas = userRutas;
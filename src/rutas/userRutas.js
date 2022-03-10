const { Router } = require('express');
const userRutas = Router();
const { userModel } = require('../modelos/userModel');
const { compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { authMid } = require('../middlewares/authMid');
const upload = require('../libs/storage');
const crypto = require('crypto');
const { transporter } = require('../config/mailer');
const { newUserOptions, resetPasswordOptions } = require('../config/emailOptions');

userRutas.get("/listar", function (req, res) {
    // Busca el producto en la BD
    userModel.find({}, function (error, user) {
        // Si hubo error
        if (error) {
            return res.status(401).send({ estado: "error", msg: "Usuarios NO encontrados" })
        } else {
            if (user !== null) {
                return res.status(200).send({ estado: "ok", msg: "Usuarios Visualizados", data: user })
            } else {
                return res.status(401).send({ estado: "error", msg: "Usuarios NO encontrados" })
            }
        }
    })
});

userRutas.post("/guardar", upload.single("avatar"), authMid, function (req, res) {
    const data = req.body;
    const toEmail = data.email;
    const name = data.nombres;
    const password = data.password;
    const user = new userModel(data);
    if (req.file) {
        const { filename } = req.file
        user.setImgUrl(filename)
    }
    user.save((error) => {
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El usuario no pudo ser creado!!!" });
        }
        try {
            transporter.sendMail(newUserOptions(toEmail, name, password))
            return res.status(200).send({ estado: "ok", msg: "El usuario fue creado exitosamente!!!", data: user })
        } catch (error) {
            return res.send({ estado: "error", msg: "Ingrese un correo válido!!!" });
        }
    })
});

userRutas.post("/registro", function (req, res) {
    const data = req.body;
    const user = new userModel(data);
    user.save((error) => {
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: Su cuenta no pudo ser creada. Intentelo más tarde!!!" });
        }
        return res.status(200).send({ estado: "ok", msg: "Su cuenta fue creada exitosamente!!!", data: user })
    })
});

userRutas.post("/editar", authMid, function (req, res) {
    const data = req.body;
    const user = new userModel(data);
    user.updateOne({
        $set: req.body
    }, (error) => {
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El usuario no pudo ser editado!!!" });
        }
        return res.status(200).send({ estado: "ok", msg: "El usuario fue editado exitosamente!!!", data: user })
    })
});

userRutas.delete("/eliminar/:nro_doc", authMid, function (req, res) {
    //Capturar los datos que vienen del cliente
    const i = req.params.nro_doc;
    //Buscar por nombre de producto en 'BD'
    userModel.findOneAndDelete({ nro_doc: i }, (error) => {
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El usuario no pudo ser eliminado!!!" })
        }
        return res.status(200).send({ estado: "ok", msg: "El usuario fue eliminado exitosamente!!!" })
    })
})

userRutas.post("/cambiar-password", function (req, res) {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const payload = verify(token, process.env.JWT_SECRET_KEY);
    userModel.findOne({ nro_doc: payload.nro_doc })
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
                                    console.log(error);
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

userRutas.post("/reset-password", function (req, res) {
    const { email } = req.body;
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
        }
        const token = buffer.toString("hex");
        userModel.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.send({ estado: "error", msg: "Por favor, revise su correo!!!" })
                }
                user.reset_token = token
                user.expire_token = Date.now() + 3600000
                user.save().then((savedUser) => {
                    const toEmail = user.email
                    const name = user.nombres
                    const resetToken = user.reset_token
                    transporter.sendMail(resetPasswordOptions(toEmail, name, resetToken))
                })
                return res.status(200).json({ estado: "ok", msg: "Por favor, revise su correo!!!" })
            })
    })
})

userRutas.post("/new-password", function (req, res) {
    const { newPassword, sentToken } = req.body
    userModel.findOne({ reset_token: sentToken, expire_token: { $gt: Date.now() } })
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
                console.log(error);
                res.send({ estado: "error", msg: "ERROR: No se pudo actualizar la contraseña" });
            })
        })
});

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
                    usuario: user.email,
                    nombre: user.nombres + " " + user.apellidos,
                    nro_doc: user.nro_doc,
                    direccion: user.direccion,
                    telefono: user.telefono,
                    rol: user.rol
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

exports.userRutas = userRutas;
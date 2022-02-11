const { Router } = require('express');
const userRutas = Router();
const { userModel } = require('../modelos/userModel');
const { compare } = require('bcryptjs');
const { sign } = require("jsonwebtoken");
const { authMid } = require('../middlewares/authMid');
const upload = require('../libs/storage');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../config/mailer');

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
    console.log(data)

    if (req.file) {
        const { filename } = req.file
        user.setImgUrl(filename)
    }

    user.save(function (error) {
        console.log(error)
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El usuario no pudo ser creado!!!" });
        }
        sendMail(toEmail, name, password)    
        return res.status(200).send({ estado: "ok", msg: "El usuario fue creado exitosamente!!!", data: user })   
    })
});

userRutas.post("/registro", function (req, res) {
    const data = req.body;
    const user = new userModel(data);
    console.log(data)
    user.save(function (error) {
        console.log(error)
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: Su cuenta no pudo ser creada. Intentelo más tarde!!!" });
        }
        return res.status(200).send({ estado: "ok", msg: "Su cuenta fue creada exitosamente!!!", data: user })
    })
});

userRutas.post("/editar", authMid, function (req, res) {
    const data = req.body;
    const user = new userModel(data);
    console.log(data)
    user.updateOne({
        $set: req.body
    }, function (error) {
        console.log(error)
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
    userModel.findOneAndDelete({ nro_doc: i }, (error, resp) => {
        if (error) {
            return res.send({ estado: "error", msg: "ERROR: El usuario no pudo ser eliminado!!!" })
        }
        return res.status(200).send({ estado: "ok", msg: "El usuario fue eliminado exitosamente!!!" })
    })
})

userRutas.post("/cambiar-password", async function (req, res) {
    const { nro_doc, currentPassword, password } = req.body;
    const user = await userModel.findOne({ nro_doc });
    const passOK = await compare(currentPassword, user.password);
    if (passOK) {
        var newPassword = bcrypt.hashSync(password, 10);
        userModel.updateOne({ nro_doc: nro_doc }, {
            $set: { password: newPassword },
        }, function (error) {
            if (error) {
                return res.send({ estado: "error", msg: "ERROR: No se pudo actualizar la contraseña"});
            }
            return res.status(200).send({ estado: "ok", msg: "Contraseña actualizada satisfactoriamente"})
        })
    } else {
        return res.send({ estado: "error"});
    }
});

userRutas.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ estado: "error", msg: "Credenciales NO válidas. Intentelo de nuevo!!!" });
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
            return res.status(401).send({ estado: "error", msg: "Credenciales NO válidas. Intentelo de nuevo!!!" });
        }
    } catch (error) {
        return res.status(401).send({ estado: "error", msg: "Credenciales NO válidas!!!" });
    }
})

exports.userRutas = userRutas;
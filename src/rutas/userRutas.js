const { Router } = require('express');
const userRutas = Router();
const { userModel } = require('../modelos/userModel');
const { compare } = require('bcryptjs');
const { sign } = require("jsonwebtoken");
const { authMid } = require('../middlewares/authMid');


userRutas.get("/listar", function (req, res) {
    // Busca el producto en la BD
    userModel.find({}, function (error, user) {
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Usuario NO encontrado" })
            return false;
        } else {
            if (user !== null) {
                res.send({ estado: "ok", msg: "Usuarios Visualizados", data: user })
            } else {
                res.send({ estado: "error", msg: "Usuarios NO encontrados" })
            }
        }
    })
});

userRutas.post("/guardar", authMid, function (req, res) {
    const data = req.body;
    const user = new userModel(data);
    console.log(data)
    user.save(function (error) {
        console.log(error)
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Usuario NO guardado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Guardado satisfactoriamente", data: user })
    })
});

userRutas.post("/registro", function (req, res) {
    const data = req.body;
    const user = new userModel(data);
    console.log(data)
    user.save(function (error) {
        console.log(error)
        if (error) {
            return res.status(401).send({ estado: "error", msg: "ERROR: Usuario NO registrado" });
        }
        return res.status(200).send({ estado: "ok", msg: "Registrado satisfactoriamente", data: user })
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
            res.send({ estado: "error", msg: "ERROR: Usuario NO actualizado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Actualizado satisfactoriamente", data: user })
    })
});

userRutas.delete("/eliminar/:nro_doc", authMid, function (req, res) {
    //Capturar los datos que vienen del cliente
    const i = req.params.nro_doc;
    //Buscar por nombre de producto en 'BD'
    userModel.findOneAndDelete({ nro_doc: i }, (error, resp) => {
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Usuario NO eliminado" })
        }
        res.send({ estado: "ok", msg: "Eliminado satisfactoriamente" })
    })
})

userRutas.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ estado: "error", msg: "Credenciales NO válidas!!!" });
        }
        const passOK = await compare(password, user.password);
        if (passOK) {
            const token = sign(
                {
                    usuario: user.email,
                    nombre: user.nombres +" "+ user.apellidos,
                    nro_doc: user.nro_doc,
                    direccion: user.direccion,
                    telefono: user.telefono,
                    rol: user.rol
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            )
            if (user.rol === 3) {
                return res.status(200).send({ estado: "ok", msg: "Logueado con éxito!!!", token, url: "/user-ext-home" });
            } else if (user.rol === 2) {
                return res.status(200).send({ estado: "ok", msg: "Logueado con éxito!!!", token, url: "/user-int/dashboard" });
            } else if (user.rol === 1) {
                return res.status(200).send({ estado: "ok", msg: "Logueado con éxito!!!", token, url: "/admin/dashboard" });
            }
        } else {
            return res.status(401).send({ estado: "error", msg: "Credenciales NO válidas!!!" });
        }
    } catch (error) {
        return res.status(401).send({ estado: "error", msg: "Credenciales NO válidas!!!" });
    }
})

exports.userRutas = userRutas;
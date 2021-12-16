const { compare } = require('bcryptjs');
const { Router } = require('express');
const userRutas = Router();
const { userModel } = require('../modelos/userModel');

userRutas.get("/listar", function (req, res) {
    // Busca el producto en la BD
    userModel.find({}, function (error, user) {
        // Si hubo error
        if (error) {
            res.send({ estado: "error", msg: "Producto NO encontrado" })
            return false;
        } else {
            if (user !== null) {
                res.send({ estado: "ok", msg: "Usuarios Visualizados", data: user })
            } else {
                res.send({ estado: "error", msg: "Producto NO encontrado" })
            }
        }
    })
});

userRutas.post("/guardar", function (req, res) {
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

userRutas.put("/editar", function (req, res) {
    let data = req.body;
    const user = new userModel(data);
    user.updateOne({
        $set: req.body
    }, function (error) {
        if (error) {
            res.send({ estado: "error", msg: "ERROR: Usuario NO actualizado" });
            return false;
        }
        res.send({ estado: "ok", msg: "Actualizado satisfactoriamente" })
    })
});

userRutas.delete("/eliminar/:nro_doc", function (req, res) {
    //Capturar los datos que vienen del cliente
    const i = req.params.nro_doc;
    //Buscar por nombre de producto en 'BD'
    userModel.findOneAndDelete({nro_doc:i},(error,resp)=>{
        if(error){
            res.send({ estado: "error", msg: "ERROR: Usuario NO eliminado" })
        }
        res.send({ estado: "ok", msg: "Eliminado satisfactoriamente" })
    })
})

userRutas.post("/login", async function (req, res) {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({ email });
        console.log(user.email)
        if (!user) {
            return res.status(401).send({ estado: "error", msg: "Credenciales NO válidas!!!" });
        }
        const passOK = await compare(password, user.password);
        if (passOK) {
            return res.status(200).send({ estado: "ok", msg: "Logueado con éxito!!!"});
        } else {
            return res.status(401).send({ estado: "error", msg: "Credenciales NO válidas!!!"});
        }   
    } catch (error) {
        return res.status(401).send({ estado: "error", msg: "Credenciales NO válidas!!!"});
    }
})

exports.userRutas = userRutas;
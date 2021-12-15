const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nro_registro:{
        type:"number",
    },
    nombre:{
        type:"string",
        required:true
    },
    apellidos:{
        type:"string",
        required:true
    },
    tipo_doc:{
        type:"string",
        required:true,
    },
    nro_doc:{
        type:"number",
        required:true,
        unique: true
    },
    email:{
        type:"string",
        required:true,
    },
    contraseña:{
        type:"string",
        required:true,
    },
    telefono:{
        type:"number",
        required:true
    },
    direccion:{
        type:"string",
        required:true
    },
    rol:{
        type:"number",
    }
})


const userModel = mongoose.model("users",userSchema);
exports.userModel = userModel;
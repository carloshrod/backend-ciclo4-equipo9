const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nombre:{
        type:"string",
        required:true
    },
    apellido:{
        type:"string",
        required:true
    },
    correoElectronico:{
        type:"string",
        required:true,
        unique:true
    },
    numDocumento:{
        type:"number",
        required:true,
        unique: true
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
        required:true
    }
})

const userModel = mongoose.model("users",userSchema);
exports.userModel = userModel;
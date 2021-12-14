const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const predioSchema = new Schema({
    codigopredio:{
        type:"string",
        unique:true,
        required:true
    },
    propietario:{
        type:"string",
        required:true
    },
    numDocumento:{
        type:"number",
        required:true,
        unique:true
    },
    areaConstruida:{
        type:"number",
        required:true
    },
    areaTotal:{
        type:"number",
        required:true
    },
    direccion:{
        type:"string",
        required:true,
        unique:true
    },
    barrio:{
        type:"string",
        required:true
    }
})

const predioModel = mongoose.model("predios",predioSchema);
exports.predioModel = predioModel;
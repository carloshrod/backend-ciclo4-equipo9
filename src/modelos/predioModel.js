const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const predioSchema = new Schema({
    codigo:{
        type:"string",
        unique:true,
        required:true
    },
    nom_prop:{
        type:"string",
        required:true
    },
    doc_prop:{
        type:"number",
        required:true,
        unique:true
    },
    area_c:{
        type:"number",
        required:true
    },
    area_t:{
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